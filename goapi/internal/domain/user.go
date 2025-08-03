// internal/domain/user.go
package domain

type User struct {
	ID   int64
	Email string
}

type UserUpdateInput struct {
	ID    int64  
	Email string 
}
