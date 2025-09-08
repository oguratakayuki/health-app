package config

import (
	"os"
)

type DBConfig struct {
	Host     string
	User     string
	Password string
	Name     string
	Port     string
}

func GetEnv() string {
	env := os.Getenv("APP_ENV")
	if env == "" {
		env = "development"
	}
	return env
}

func GetDBConfig() DBConfig {
	env := GetEnv()

	switch env {
	case "test":
		return DBConfig{
			Host:     getEnvOrDefault("DB_HOST", "db"),
			User:     getEnvOrDefault("DB_USER", "root"),
			Password: getEnvOrDefault("DB_PASSWORD", "rootp"),
			Name:     getEnvOrDefault("DB_NAME_TEST", "health_test"),
			Port:     getEnvOrDefault("DB_PORT", "3306"),
		}
	case "production":
		return DBConfig{
			Host:     os.Getenv("DB_HOST"),
			User:     os.Getenv("DB_USER"),
			Password: os.Getenv("DB_PASSWORD"),
			Name:     os.Getenv("DB_NAME"),
			Port:     os.Getenv("DB_PORT"),
		}
	default: // development
		return DBConfig{
			Host:     getEnvOrDefault("DB_HOST", "db"),
			User:     getEnvOrDefault("DB_USER", "root"),
			Password: getEnvOrDefault("DB_PASSWORD", "rootp"),
			Name:     getEnvOrDefault("DB_NAME", "health_development"),
			Port:     getEnvOrDefault("DB_PORT", "3306"),
		}
	}
}

func getEnvOrDefault(key, def string) string {
	val := os.Getenv(key)
	if val == "" {
		return def
	}
	return val
}

