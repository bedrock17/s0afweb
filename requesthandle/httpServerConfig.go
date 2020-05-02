package requesthandle

//HTTPServerConfifg : HTTP 및 HTTPS 설정 관련
type HTTPServerConfifg struct {
	HTTPPort  int
	HTTPSPort int
	HostName  string //인증서 이름을 만드는데 사용
}
