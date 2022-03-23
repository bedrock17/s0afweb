package auth

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"github.com/labstack/echo/v4"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"io"
	"io/ioutil"
	"math/rand"
	"net/http"
	"os"
	"time"
)

const UserInfoAPIEndpoint = "https://www.googleapis.com/oauth2/v3/userinfo"

var oauthConfig = oauth2.Config{
	ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
	ClientSecret: os.Getenv("GOOGLE_SECRET_KEY"),
	Endpoint:     google.Endpoint,
	RedirectURL:  fmt.Sprintf("%v/api/v1/auth/google/callback", os.Getenv("PUBLIC_URL")),
	Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email"},
}

type GoogleUser struct {
	Name  string `json:"name"`
	Email string `json:"email"`
}

func GetGoogleSignInUrl(c echo.Context) string {
	expiration := time.Now().Add(7 * 24 * time.Hour)

	b := make([]byte, 16)
	rand.Read(b)
	state := base64.URLEncoding.EncodeToString(b)
	cookie := &http.Cookie{
		Name:    "oauthstate",
		Value:   state,
		Expires: expiration,
	}
	c.SetCookie(cookie)
	if oauthConfig.ClientID == "" {
		oauthConfig.ClientID = os.Getenv("GOOGLE_CLIENT_ID")
		oauthConfig.ClientSecret = os.Getenv("GOOGLE_SECRET_KEY")
	}
	return oauthConfig.AuthCodeURL(state)
}

func GetGoogleUserInfo(code string) (GoogleUser, error) {
	token, err := oauthConfig.Exchange(context.Background(), code)
	if err != nil {
		return GoogleUser{}, err
	}

	client := oauthConfig.Client(context.Background(), token)
	userInfoResp, err := client.Get(UserInfoAPIEndpoint)
	if err != nil {
		return GoogleUser{}, err
	}

	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			return
		}
	}(userInfoResp.Body)

	userInfo, err := ioutil.ReadAll(userInfoResp.Body)
	if err != nil {
		return GoogleUser{}, err
	}

	var authUser GoogleUser
	if err := json.Unmarshal(userInfo, &authUser); err != nil {
		return GoogleUser{}, err
	}
	return authUser, nil
}
