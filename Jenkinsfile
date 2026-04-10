pipeline {
    agent any

    environment {
        DOCKER_HUB_REPO_BACKEND = "nikhilabba12/food-backend"
        DOCKER_HUB_REPO_FRONTEND = "nikhilabba12/food-frontend"
        IMAGE_TAG = "latest"
        RENDER_BACKEND_HOOK = credentials('render-backend-deploy-hook')
        RENDER_FRONTEND_HOOK = credentials('render-frontend-deploy-hook')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Verify Files') {
            steps {
                bat 'dir'
                bat 'if not exist backend\\Dockerfile exit /b 1'
                bat 'if not exist frontend\\Dockerfile exit /b 1'
                bat 'if not exist backend\\package.json exit /b 1'
                bat 'if not exist backend\\server.js exit /b 1'
            }
        }

        stage('Build Backend Image') {
            steps {
                bat 'docker build -t %DOCKER_HUB_REPO_BACKEND%:%IMAGE_TAG% ./backend'
            }
        }

        stage('Build Frontend Image') {
            steps {
                bat 'docker build -t %DOCKER_HUB_REPO_FRONTEND%:%IMAGE_TAG% ./frontend'
            }
        }

        stage('Docker Hub Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    bat 'echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin'
                }
            }
        }

        stage('Push Backend Image') {
            steps {
                bat 'docker push %DOCKER_HUB_REPO_BACKEND%:%IMAGE_TAG%'
            }
        }

        stage('Push Frontend Image') {
            steps {
                bat 'docker push %DOCKER_HUB_REPO_FRONTEND%:%IMAGE_TAG%'
            }
        }

        stage('Trigger Render Backend Deploy') {
            steps {
                bat 'curl -X POST %RENDER_BACKEND_HOOK%'
            }
        }

        stage('Trigger Render Frontend Deploy') {
            steps {
                bat 'curl -X POST %RENDER_FRONTEND_HOOK%'
            }
        }
    }

    post {
        always {
            bat 'docker logout'
        }
        success {
            echo 'Pipeline completed successfully'
        }
        failure {
            echo 'Pipeline failed'
        }
    }
}