if (!window.orga) {
    window.orga = {
        registerApp: function() {
            var date = new Date();
            var uniqueId = date.getFullYear() + "" + date.getMonth() + "" + date.getDate() + "" + date.getHours();
            uniqueId += date.getMinutes() + "" + date.getSeconds() + "-" + Math.floor((Math.random() * 1000) + 1);
            database.storeRegId(uniqueId);
        },
        /**
         * Date time picker section
         */
        selectedDate: null,

        dateTimePicker: {
            init: function(timestamp) {
                var today;
                var currentValueDate, currentValueTime;
                if (timestamp != undefined) {
                    today = new Date(timestamp);
                    //currentValueDate = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();
                    currentValueDate = today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate();
                    currentValueTime = today.getHours() + ":" + today.getMinutes();
                } else {
                    today = new Date();
                    //currentValueDate = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();
                    currentValueDate = today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate();
                    currentValueTime = today.getHours() + ":" + today.getMinutes();
                }



                //Date picker init
                $('#dateTimeNote').datetimepicker({
                    format: 'Y/m/d H:i',
                    formatDate: 'Y/m/d',
                    dayOfWeekStart: 1,
                    lang: 'en',
                    startDate: currentValueDate,
                    value: currentValueDate + " " + currentValueTime,
                    step: 10,
                    onChangeDateTime: function(dp, $input) {
                        orga.selectedDate = dp;
                    }
                });
            },
        },

        //Form validation before saving
        validateForm: function(timestamp, title, message) {

            if (timestamp == null || title.trim() == "" || message.trim() == "") {
                alert('Please enter complete form.');
                return false;
            }

            return true;
        },

        //Method to render the list of saved entries
        renderList: function() {
            var data = database.notesDataArray;
            //Empty list
            $(".listContainer").html("");

            if (data.data.length > 0) {
                $.ajax({
                    url: "views/list_item.tmpl.html",
                    success: function(source) {
                        template = Handlebars.compile(source);
                        $(".listContainer").html(template(data));
                        $(".listContainer").listview("refresh");
                        $("body").trigger("create");
                    },
                    async: false
                });
            } else {
                //No data in the list, hide the clear all button
                $("#clearAllData").hide();
                $("#clearAllData").hide();
            }

        },

        //Method to delete 
        deleteItem: function(id) {
            var index = database.getItemIndex(id);
            if (index != -1) {
                database.notesDataArray.data.splice(index, 1);
                database.saveData();
            }

            app.changePage("listPage");

            logger.log(id, "delete");
        }

    };
};
