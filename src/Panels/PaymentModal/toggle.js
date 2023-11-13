import $ from 'jquery';

function toggler(){
    $('.accordion-toggle').click(function(){
        $('.hiddenRow').hide();
        $(this).next('tr').find('.hiddenRow').show();
    });
}

export default toggler