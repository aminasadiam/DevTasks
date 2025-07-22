package models

import "gorm.io/gorm"

type Project struct {
	gorm.Model
	Name        string
	Description string
	UserId      uint
	User        User `gorm:"foreignKey:UserId"`
}
