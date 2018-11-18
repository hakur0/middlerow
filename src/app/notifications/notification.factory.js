angular.module('middlerow').factory('NotificationFactory', ()=>{
    const levels = [
        'error',
        'notice'
    ];

    /**
     * Creates Notification objects
     * @param {string} level The notification level ('error' or 'notice')
     * @param {string} title The title of the notification, eg: 'Connection error'
     * @param {string} description The description of the notification
     * @constructor
     */
    const Notification = function(level, title, description){
        if(levels.indexOf(level) === -1){
            console.error(`'${level}' is not a known notification level. Defaulting to 'notice'.`)
            level = 'notice';
        }

        this.level = level;
        this.title = title;
        this.description = description;
    };

    return Notification;
});
