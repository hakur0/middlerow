angular.module('middlerow').controller('NotificationListController', NotificationListController);

NotificationListController.$inject = ['$timeout', '$rootScope'];

function NotificationListController($timeout, $rootScope){
    const self = this;

    this.model = {
        notifications: []
    };
    this.removeNotification = removeNotification;

    this.$onInit = ()=>{
        // This is not the best way to communicate between components, but I don't have the time
        // to create a proper service for this :( Super sorry!
        self._$notificationUpdate = $rootScope.$on('sendNotification', (event, notification)=>{
            showNotification(notification);
        });
    };

    this.$onDestroy = ()=>{
        self._$notificationUpdate();
    };


    function showNotification(notification){
        self.model.notifications.push(notification);

        // Dismiss the notification after 10 seconds
        $timeout(10000).then(()=>{
            removeNotification(notification)
        });
    }

    /**
     * Dismiss a notification from the list
     * @param {Notification} notification The notification to dismiss
     */
    function removeNotification(notification){
        const notification_index = self.model.notifications.indexOf(notification);

        if(notification_index !== -1){
            self.model.notifications.splice(notification_index, 1);
        }
    }
}
