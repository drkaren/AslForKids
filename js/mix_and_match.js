/**
 * Created by Timothy on 12/8/2014.
 */

$(function() {
    $("#nondraggable, #draggable").draggable();
    $("#droppable").droppable({
            accept: "#draggable",
            activeClass: "ui-state-hover",
            hoverClass: "ui-state-active",
            drop: function(event, ui){
                $(this).addClass("ui-state-highlight").find("p").html("Dropped!");
            }
        }
    )
});