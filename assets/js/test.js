

$(document).ready(function(){
    
    findCanton();

});
    
 
/**
 * 
 * @returns {undefined}
 */
function findCanton(){

    $.getJSON(
            'dispatcher.php', 
            {
                    controlleur: 'Parcours',
                    action: "findByCanton"
            }, 

            function(data) {
                
                $.each(data, function(key, value){
                    
                    var div_principale = $('<div data-role="collapsible"/>')
                    var h2 = $('<h2/>').html(key)
                    var wrapper = div_principale.append(h2)
                    wrapper.appendTo('#total')
                    
                    var ul = $('<ul data-role="listview" data-filter="true" data-filter-theme="c" data-divider-theme="d"/>')
                    $.each(value, function(key2, value2){
                        
                        var li = $('<li/>')
                        var a = $('<a href="mobile_map.html?id'+value2.parcours_id+'"/>').html(value2.nom)
                       
                        li.append(a)
                        ul.append(li)
                       
                    });
                    ul.appendTo(div_principale).trigger('create')
                });
                
                $('#total').append('').trigger('create');
            }
    );
}
