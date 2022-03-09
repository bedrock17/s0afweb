package handler

import (
	"github.com/bedrock17/s0afweb/dao"
	"github.com/bedrock17/s0afweb/models"
	"github.com/bedrock17/s0afweb/service/auth"
	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	"net/http"
)

type GoogleUserValidateRequest struct {
	IdToken string `json:"id_token" validate:"required,min=1"`
}

type GoogleUserValidateResponse struct {
	Email string `json:"email"`
	Name  string `json:"name"`
}

func RedirectGoogleSignIn(c echo.Context) error {
	return c.Redirect(http.StatusTemporaryRedirect, auth.GetGoogleSignInUrl(c))
}

func GoogleSignInCallback(c echo.Context) error {
	// google auth
	state := c.QueryParam("code")
	code := c.FormValue("code")
	if code != state {
		// TODO: add error message context
		return c.Redirect(http.StatusTemporaryRedirect, "/")
	}

	googleUser, err := auth.GetGoogleUserInfo(code)
	if err != nil {
		// TODO: add error message context
		return c.Redirect(http.StatusTemporaryRedirect, "/")
	}

	// create or get user from db
	user := models.User{
		Provider:   models.GoogleIdP,
		ExternalId: googleUser.Email,
	}
	repo := dao.GetRepository().User()
	err = repo.GetOrCreate(&user)
	if err != nil {
		// TODO: add error message context
		return c.Redirect(http.StatusTemporaryRedirect, "/")
	}

	// session
	sess, err := session.Get("session", c)
	if err != nil {
		// TODO: add error message context
		return c.Redirect(http.StatusTemporaryRedirect, "/")
	}
	sess.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   86400 * 7,
		HttpOnly: true,
	}
	sess.Values["tag"] = user.Tag
	sess.Save(c.Request(), c.Response())

	return c.Redirect(http.StatusTemporaryRedirect, "/")
}
