package model

// User : 사용자 정보를 담는다
type User struct {
	UserName       string
	NickName       string
	hashedPassword string
}
