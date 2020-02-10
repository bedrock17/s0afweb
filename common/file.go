package common

import "os"

//FileExists : 파일이 존재하는지 검사
func FileExists(filename string) bool {
	info, err := os.Stat(filename)
	if os.IsNotExist(err) {
		return false
	}
	return !info.IsDir()
}
