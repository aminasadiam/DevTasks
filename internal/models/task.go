package models

import (
	"encoding/json"

	"gorm.io/gorm"
)

type Task struct {
	gorm.Model
	Title       string  `json:"Title"`
	Description string  `json:"Description"`
	ProjectId   uint    `json:"ProjectId"`
	Project     Project `gorm:"foreignKey:ProjectId" json:"-"`
	AssignedTo  uint    `json:"AssignedTo"`
	User        User    `gorm:"foreignKey:AssignedTo" json:"-"`
}

// MarshalJSON overrides the default JSON marshaling to use the expected field names
func (t Task) MarshalJSON() ([]byte, error) {
	type Alias Task
	return json.Marshal(&struct {
		ID        uint   `json:"ID"`
		CreatedAt string `json:"created_at"`
		UpdatedAt string `json:"updated_at"`
		*Alias
	}{
		ID:        t.ID,
		CreatedAt: t.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		UpdatedAt: t.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
		Alias:     (*Alias)(&t),
	})
}
