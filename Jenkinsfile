pipeline {
    agent {
        docker.withServer('tcp://docker:2376') {
            docker {
                image 'node:14' 
                args '-p 3000:3000'
            }
        }
    }
    stages {
        stage('Build') { 
            steps {
                sh 'npm install' 
            }
        }
    }
}
