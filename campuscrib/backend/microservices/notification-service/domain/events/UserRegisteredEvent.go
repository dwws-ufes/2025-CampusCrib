package events

type UserRegisteredEvent struct {
	ID                string `json:"id"`
	Email             string `json:"email"`
	FullName          string `json:"fullName"`
	ConfirmationToken string `json:"confirmationToken"`
}
