$("document").ready(function(){
    
    findCanton();
    
    

});
    

function findCanton(){

    $.getJSON(
            'dispatcher.php', 
            {
                    controlleur: 'Parcours',
                    action: "findByCanton"
            }, 

            function(data) {
                var i =0
                var ul = $('<ul class="ui-listview ui-listview-inset ui-corner-all ui-shadow ui-icon-alt" data-inset="true" data-role="listview"/>')
                $.each(data, function(key, value){
                    
                    var li = $('<li class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-c" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c"/>')
                    var divInner = $('<div class="ui-btn-inner ui-li"/>')
                    var divText = $('<div class="ui-btn-text"/>')
                    var a = $('<a class="ui-link-inherit link" data-transition="slide" href="mobile_parcours.html?canton='+key+'"/>').html(key)

                    divText.append(a)
                    divInner.append(divText)
                    li.append(divInner)
                    var wrapper = ul.append(li)
                    
                    wrapper.appendTo('#total')
                    
                    
                    $.each(value, function(key, value){
                        console.log(key, value);
                    });
                });
            }
    );
        

}
