$(document).ready(function(){
    $(".button-collapse").sideNav();
    var colors = ['red', 'blue', 'green', 'grey'];
    var positions = ['center-align', 'right-align', 'left-align'];
    var sliders = $('.promo .caption');
    for(var i=0; i<sliders.length; i++){
        $(sliders[i]).addClass(positions[i%(positions.length-1)]);
        $(sliders[i]).parent().addClass(colors[i%(colors.length)]);
    }

    $('.banner').slider();
    $('.promo').slider({height: 200, transition: 800, interval: 5000});
    $('ul.tabs').tabs();

    $('.delete').on('click', function(evt){
        evt.preventDefault();
        $('#modal').openModal();
        $('#agree').click(function(){
            var toDelete = {
                type: location.href.split('/')[4],
                id: evt.currentTarget.id
            };
            $.post('/admin/delete', toDelete, function(res){
                if(res.success == true){
                    Materialize.toast('Deleted successfully', 1500, 'rounded', function(){
                        location.reload();
                    });
                }
                else {
                    Materialize.toast('Something went wrong', 1500, function(){
                        location.reload();
                    })
                }
            });
        });
    });
});