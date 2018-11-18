angular.module('middlerow').factory('HttpErrorHandler', HttpErrorHandler);

HttpErrorHandler.$inject = ['$rootScope', 'NotificationFactory'];

function HttpErrorHandler($rootScope, NotificationFactory){
    return{
        'responseError': (response)=>{
            if(response.status === 429){
                $rootScope.$emit(
                    'sendNotification',
                    new NotificationFactory('error', 'Erro de conexão', 'Você passou do limite de ' +
                        'requisições por segundo da API. Aguarde alguns segundos para continuar.')
                )
            } else if(!window.navigator.onLine){
                $rootScope.$emit(
                    'sendNotification',
                    new NotificationFactory('error', 'Erro de conexão', 'Uma requisição não pôde ser ' +
                        'completa porque você está offline. Conecte-se à Internet e tente novamente.')
                )
            }

            return response;
        }
    }
}
