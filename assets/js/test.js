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
                    i++
                    alert(i)
                    var div =$('<div class="ui-collapsible ui-collapsible-inset ui-collapsible-themed-content ui-collapsible-collapsed ui-first-child ui-last-child" data-role="collapsible"><h2 class="ui-collapsible-heading ui-collapsible-heading-collapsed">'+key+'</2></div>')
       
                    div.appendTo("#total")
                    //$('#title').append('<div data-role="collapsible"><h2>'+key+'</2></div>');
                    $.each(value, function(key, value){
                        console.log(key, value);
                    });
                });
            }
    );
}

/*
<div data-role="collapsible">
                <h2>Vaud</h2>
                <ul data-role="listview" data-filter="true" data-filter-theme="c" data-divider-theme="d">
                    <li><a href="index.html">Adam Kinkaid</a></li>
                    <li><a href="index.html">Alex Wickerham</a></li>
                    <li><a href="index.html">Avery Johnson</a></li>
                    <li><a href="index.html">Bob Cabot</a></li>
                    <li><a href="index.html">Caleb Booth</a></li>
                </ul>
            </div>
            */