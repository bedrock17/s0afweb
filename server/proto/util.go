package proto

import (
	pb "google.golang.org/protobuf/proto"
	"google.golang.org/protobuf/types/known/anypb"
)

func ToAny(message pb.Message) *anypb.Any {
	any := new(anypb.Any)
	err := anypb.MarshalFrom(any, message, pb.MarshalOptions{})
	if err != nil {
		panic(err)
	}
	return any
}
