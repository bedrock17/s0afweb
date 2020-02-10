package common

//Check : panic error
func Check(e error) {
	if e != nil {
		panic(e)
	}
}
