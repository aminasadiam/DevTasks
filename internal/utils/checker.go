package utils

import "strings"

func IsValidEmail(email string) bool {
	if !strings.Contains(email, "@") {
		return false
	}

	if !strings.Contains(email, ".com") {
		return false
	}

	return true
}

func IsValidPassword(password string) bool {
	if len(password) < 8 || len(password) > 200 {
		return false
	}

	return true
}
