package models

import "gorm.io/gorm"

type Task struct {
	gorm.Model
	Title       string
	Description string
	ProjectId   uint
	Project     Project `gorm:foreignKey:ProjectId"`
	AssignedTo  uint
	User        User `gorm:"foreignKey:AssignedTo"`
}
