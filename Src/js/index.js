$(function(){
//   $('ol li').click(function(){
//       scrollToTop($("."+$(this).attr("id")).offset().top)
//   })
  $(document).scroll(function() {
    if ($(document).height() <= (parseInt($(document).scrollTop() + 1) + $(window).height())){  //滚动条滑到底部啦
      $("ol li").removeClass('active')
      $("ol li:last").addClass('active')
      return;
    }
    var top = $(document).scrollTop(); 
    $(".text").each(function (i,item) {
        if($(this).offset().top <= top){
            $("ol li").removeClass('active')
            $("#"+item.classList[1]).addClass('active');
        }
    })
  });
})
function scrollToTop(number) {
  window.scrollTo({
      top: number,
      behavior: "smooth"
  });
}