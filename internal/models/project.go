package models

import (
	"encoding/json"

	"gorm.io/gorm"
)

type Project struct {
	gorm.Model
	Name        string `json:"Name"`
	Description string `json:"Description"`
	UserId      uint   `json:"UserId"`
	User        User   `gorm:"foreignKey:UserId" json:"-"`
}

// MarshalJSON overrides the default JSON marshaling to use the expected field names
func (p Project) MarshalJSON() ([]byte, error) {
	type Alias Project
	return json.Marshal(&struct {
		ID        uint   `json:"ID"`
		CreatedAt string `json:"created_at"`
		UpdatedAt string `json:"updated_at"`
		*Alias
	}{
		ID:        p.ID,
		CreatedAt: p.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		UpdatedAt: p.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
		Alias:     (*Alias)(&p),
	})
}
