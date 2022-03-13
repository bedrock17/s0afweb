package errors

import (
	"errors"
	"fmt"
)

type WSError struct {
	Id  int
	Err error
}

func (w WSError) Error() string {
	return fmt.Sprintf("%s (%v)", w.Err.Error(), w.Id)
}

var (
	InvalidSessionErr         = WSError{Id: 50000, Err: errors.New("invalid session")}
	UserNotFoundErr           = WSError{Id: 50001, Err: errors.New("user not found")}
	NoLeftSeatErr             = WSError{Id: 40000, Err: errors.New("no player slot left")}
	InvalidRoomIdErr          = WSError{Id: 40001, Err: errors.New("invalid room id")}
	CannotJoinMultipleRoomErr = WSError{Id: 40002, Err: errors.New("user is already in the room")}
	GameValidationErr         = WSError{Id: 40003, Err: errors.New("invalid game")}
	GameAlreadyStartedErr     = WSError{Id: 40004, Err: errors.New("game already started")}
	MinimumNumberPlayerErr    = WSError{Id: 40005, Err: errors.New("can't start the game alone")}
	UnauthorizedErr           = WSError{Id: 40006, Err: errors.New("unauthorized")}
)
