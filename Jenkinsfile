pipeline {
    agent any

    environment {
        DOCKER_HUB_USERNAME = "nikhilabba12"
        DOCKER_HUB_REPO_BACKEND = "${DOCKER_HUB_USERNAME}/food-backend"
        DOCKER_HUB_REPO_FRONTEND = "${DOCKER_HUB_USERNAME}/food-frontend"
        IMAGE_TAG = "latest"
    }

    options {
        skipDefaultCheckout(true)
    }

    stages {
        stage('SCM Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Check') {
            steps {
                bat 'dir'
                bat 'if not exist backend\\Dockerfile exit /b 1'
                bat 'if not exist frontend\\Dockerfile exit /b 1'
                bat 'if not exist backend\\package.json exit /b 1'
                bat 'if not exist backend\\server.js exit /b 1'
                bat 'if not exist frontend\\index.html exit /b 1'
            }
        }

        stage('Test Backend') {
            steps {
                bat 'cd backend && npm install'
                bat 'cd backend && npm list --depth=0'
            }
        }

        stage('Build Docker Backend Image') {
            steps {
                bat 'docker build -t %DOCKER_HUB_REPO_BACKEND%:%IMAGE_TAG% ./backend'
            }
        }

        stage('Build Docker Frontend Image') {
            steps {
                bat 'docker build -t %DOCKER_HUB_REPO_FRONTEND%:%IMAGE_TAG% ./frontend'
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    bat '''
@echo off
echo Logging into Docker Hub...
echo %DOCKER_PASS%| docker login -u %DOCKER_USER% --password-stdin
if %ERRORLEVEL% neq 0 exit /b %ERRORLEVEL%
'''
                }
            }
        }

        stage('Docker Push Backend') {
            steps {
                bat 'docker push %DOCKER_HUB_REPO_BACKEND%:%IMAGE_TAG%'
            }
        }

        stage('Docker Push Frontend') {
            steps {
                bat 'docker push %DOCKER_HUB_REPO_FRONTEND%:%IMAGE_TAG%'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully'
        }
        failure {
            echo 'Pipeline failed'
        }
        always {
            echo 'Pipeline finished'
        }
    }
}