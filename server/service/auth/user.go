package auth

import (
	"math/rand"
)

const letters = "0123456789BCDFGHJKLMNPQRSTVWXYZbcdfghjklmnpqrstvwxyz"
const letterLength = len(letters)

func GenerateRandomString(n int) string {
	b := make([]byte, n)
	for i := range b {
		b[i] = letters[rand.Intn(letterLength)]
	}

	return string(b)
}
