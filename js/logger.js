/**
 *Logger method
 */
if (!window.logger) {
    window.logger = {


        IS_DATABASE_PRESENT: "is_log_db_present",

        CONTENT_DATA_KEY: "log_data",

        logsDataArray: {
            data: []
        },

        logDataFormat: {
            id: null,
            type: null,
            timestamp: null
        },

        init: function() {
            var that = this;
            if (that.getLocalItem(that.IS_DATABASE_PRESENT)) {
                that.logsDataArray = that.getLocalItem(that.CONTENT_DATA_KEY);
            }
        },

        renderLogsList: function() {
            var that = this;
            var data = that.logsDataArray;
            //Empty list
            $(".loglistContainer").html("");

            if (data.data.length > 0) {
                $.ajax({
                    url: "views/loglist_item.tmpl.html",
                    success: function(source) {
                        template = Handlebars.compile(source);
                        $(".loglistContainer").html(template(data));
                        $(".loglistContainer").listview("refresh");
                        $("body").trigger("create");
                    },
                    async: false
                });
            }

        },

        saveData: function() {
            var that = this;
            that.setLocalItem(that.CONTENT_DATA_KEY, that.logsDataArray);
        },

        log: function(id, type) {
            var that = this;
            var logData = JSON.parse(JSON.stringify(that.logDataFormat));
            logData.id = id;
            logData.type = type;
            logData.timestamp = (new Date()).getTime();

            that.logsDataArray.data.push(logData);

            //Save data
            that.saveData();
        },

        getLocalItem: function(key) {
            var that = this;
            if (key === that.IS_DATABASE_PRESENT) {
                return window.localStorage.getItem(key, false);
            } else {
                return JSON.parse(window.localStorage.getItem(key));
            }
        },

        setLocalItem: function(key, value) {
            var that = this;
            try {

                if (key === that.CONTENT_DATA_KEY) {
                    window.localStorage.setItem(that.IS_DATABASE_PRESENT, true);
                    window.localStorage.setItem(key, JSON.stringify(value));
                } else {
                    window.localStorage.setItem(key, value);
                }
            } catch (e) {
                alert("We had an issue saving the data locally..");
            }

        }
    };
};