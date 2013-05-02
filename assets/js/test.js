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
                $.each(data, function(key, value){
                    
                    var div = $('<div class="ui-collapsible ui-collapsible-inset ui-collapsible-themed-content ui-first-child ui-last-child ui-collapsible-collapsed" data-role="collapsible"/>')
                    var h2 = $('<h2 class="ui-collapsible-heading ui-collapsible-heading-collapsed"/>')
                    var a = $('<a class="ui-collapsible-heading-toggle ui-btn ui-btn-icon-left ui-btn-up-b" href="#" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="span" data-icon="plus" data-iconpos="left" data-theme="b"/>')
                    var spanInner = $('<span class="ui-btn-inner"/>')
                    var spanText = $('<span class="ui-btn-text"/>').html(key)
                    
                    console.log(key)
                    
                    
                    spanInner.append(spanText)
                    a.append(spanInner)
                    h2.append(a)
                    var wrapper = div.append(h2)
                    
                  //  wrapper.append(a)
                    wrapper.appendTo('#total')
                    
                    //div.append(h2).append(a).append(spanInner).append(spanText).appendTo('#total')
                    //spanInner.append(spanText).appendTo('#total');
                    //spanText.append(spanInner).appendTo('#total')
                    //$('#title').append('<div data-role="collapsible"><h2>'+key+'</2></div>');
                    $.each(value, function(key, value){
                        console.log(key, value);
                    });
                });
            }
    );
}
