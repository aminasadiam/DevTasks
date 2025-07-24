package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Username     string
	Email        string `gorm:"unique"`
	Password     string
	Profile      string
	SessionToken string
	CSRFToken    string
}
