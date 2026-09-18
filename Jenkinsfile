pipeline {

    agent any


    stages {


        stage('Verify Environment') {

            steps {

                sh 'git --version'

                sh 'docker --version'

                sh 'docker compose version'

                sh 'docker ps'

            }

        }


        stage('Deploy') {

            steps {

                sh './scripts/deploy.sh'

            }

        }


    }
post {

        success {

            echo 'QuickCart deployment successful'

        }


        failure {

            echo 'QuickCart deployment failed'

        }

    }

}
