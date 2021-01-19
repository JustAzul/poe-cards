$(function() { 

    var offsetPixels = 876;
    $(window).scroll(function(){
        if($(window).scrollTop() > offsetPixels){
            $("tr.row100.head").css({
                'position': 'fixed',
                'top':'40px'
            })
        } else {
            $("tr.row100.head").css({
                'position': 'static',
                'top': '0'
            })
        }
    })           

    var socket = io.connect();
    var pageLeague = $("#pageLeague").val();
    
    setInterval(function(){
        var _last_upt = moment(LastUpdatedDate).fromNow();
        $("#LastUpdate").html(_last_upt);
    }, moment.duration(2, 'seconds'));

    socket.on("NewTab", function(){
        alert("You have opened another tab, and this one will not be automatic updated anymore, use the other tab instead :)");                
    })
    
    socket.on("LeagueConnects", function(data) {
        $('#onlines').numerator({
            duration: 1000,
            delimiter: ',',
            toValue: data[pageLeague]
        });
        
    })

    socket.on("Update", function(data, LeagueName){        

        if(LeagueName != pageLeague){
            return;
        }

        ExaltedValue = data.ExaltedValue;

        $('#ExaltedValue').numerator({
            duration: 1000,
            delimiter: ',',
            toValue: data.ExaltedValue
        });

        $('#DivineValue').numerator({
            duration: 1000,
            delimiter: ',',
            toValue: data.DivineValue
        });

        $('#AnnullValue').numerator({
            duration: 1000,
            delimiter: ',',
            toValue: data.AnnullValue
        });

        
        //var MirrorExaltedValue = (data.MirrorValue+ExaltedValue) > 0 ? Math.round(data.MirrorValue/ExaltedValue) : 0;

        $('#MirrorValue').numerator({
            duration: 1000,
            delimiter: ',',
            toValue: data.MirrorValue
        });

        $('#MirrorValueExalted').numerator({
            duration: 1000,
            delimiter: ',',
            toValue: data.MirrorExaltedValue
        });

        $("#SplitedBodyContent").html(data.SplitedBodyContent);
        //destroy active popovers
        $('[id=poetrade]').popover('hide');
        $("#TableContent").html(data.Table);    
        
        LastUpdatedDate = data.LastUpdate;

        MakeButtons();
        table();
    });

    $('#itemChaosValueChange').on('input', updateChangeResult);
    $('#itemAmountValueChange').on('input', updateChangeResult);
    $('#ExaltedPaymentValueChange').on('input', updateChangeResult);

    function ChaosToExalted(ChaosValue) { return (ChaosValue / ExaltedValue); }

    if (Cookies.get("itemChaosValueChange" + pageLeague) != undefined) {
        var _val = Cookies.get("itemChaosValueChange" + pageLeague);
        $("#itemChaosValueChange").val(parseInt(_val));
    }

    if (Cookies.get("itemAmountValueChange" + pageLeague) != undefined) {
        var _val = Cookies.get("itemAmountValueChange" + pageLeague);
        $("#itemAmountValueChange").val(parseInt(_val));
    }

    if (Cookies.get("ExaltedPaymentValueChange" + pageLeague) != undefined) {
        var _val = Cookies.get("ExaltedPaymentValueChange" + pageLeague);
        $("#ExaltedPaymentValueChange").val(parseInt(_val));
    }

    updateChangeResult();

    function updateChangeResult(){
        var ItemChaosValue = $("#itemChaosValueChange").val();
        var ItemAmountValue = $("#itemAmountValueChange").val();
        var ExaltedPaymentValue = $("#ExaltedPaymentValueChange").val();
        
        Cookies.set('itemChaosValueChange' + pageLeague, ItemChaosValue);
        Cookies.set('itemAmountValueChange' + pageLeague, ItemAmountValue);
        Cookies.set('ExaltedPaymentValueChange' + pageLeague, ExaltedPaymentValue);

        var TotalChaosPayment = ExaltedPaymentValue * ExaltedValue;
        var TotalItemChaosValue = ItemChaosValue * ItemAmountValue;
        var Result = Math.round(TotalChaosPayment-TotalItemChaosValue);
        
        
        
        $('#totalpayment').numerator({
            duration: 100,
            delimiter: ',',
            toValue: TotalItemChaosValue
        });
        
        $('#ChangeResult').numerator({
            duration: 100,
            delimiter: ',',
            toValue: Result
        });
        

    }

    function MakeButtons(){
        $("[id='poetrade']").click(function(){
        var ItemName = $(this).data("name");
        var buyout_max = $(this).data("buyout");

        if(buyout_max >= ExaltedValue){
            buyout_max = ChaosToExalted(buyout_max);
            $("#b_currency").val("exalted");
        } else {
            $("#b_currency").val("chaos");
        }
        
        window.open('', ItemName);
        
        $("#SearchForm").attr("target", ItemName);
        $("#inputName").val(ItemName);
        //$("#b_max").val(buyout_max);
        $("#SearchForm").submit();
        }) 
    }                 

    MakeButtons();
});  