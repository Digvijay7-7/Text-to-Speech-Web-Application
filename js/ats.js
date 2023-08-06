var ats = {
    aws_acKey: "Access key ID",
    aws_scKey: "Secret access key",
    aws_region: "AWS Region"
}


ats.isEmpty = function (valText) {
    var retIsEmpty = false;
    if (null == valText || typeof valText == 'undefined' || valText.length < 1 || !valText.match(/\S/))
    {
        retIsEmpty = true;
    } else
    {
        retIsEmpty = false;
    }
    return retIsEmpty;
};

/**
 * Form validation is performing ...
 * Any value is returns empty/blank failed count will be increases and return false
 * 
 * @returns 
 * If failed count is > 0 return false else return true
 */
ats.validate = function(){   
    $("#frmSetting .flderr").hide();

    var getSelEngine = $('input:radio[name=engine]:checked').val();
    var getText = $("#fldSpeechText").val();
    var failedct = 0;

    if(ats.isEmpty(getSelEngine) == true){
        $("#rdoEngine_err").show();
        failedct++;
    }

    if(ats.isEmpty(getText) == true){
        $("#fldSpeechText_err").show();
        failedct++;
    }

    if(failedct > 0){
        $("#comm_err").show();
        return false;
    }
    else{
        return true;
    }
}


/**
 * First validate the setting form. If validation successfull then following
 * process executes
 * 
 * Mehtod invokes the aws polly request. Method takes the all form settings ... 
 * and sends to polly. polly retrurns the blob of text to speed audio.
 * 
 * That recived audio blob play in the audio tag.
 *  
 * @returns 
 * If form validation fails then false otherwise true
 * 
 */
ats.play = function(){
    if(ats.validate() == false){
        return false;
    }

    //to get selected value of engine
    var getSelEngine = $('input:radio[name=engine]:checked').val();

    //to get selected value of language 
    var selLang = $("#fldLag").val();

    //to get input text 
    var getText = $("#fldSpeechText").val();                          

    //Configure AWS 
    AWS.config.accessKeyId = ats.aws_acKey;
    AWS.config.secretAccessKey = ats.aws_scKey;
    AWS.config.region = ats.aws_region;

    //initialize amazon polly services
    var polly = new AWS.Polly(); 
    
    //Switch case is used for selecting appropriate voice for the selected language
    switch(selLang){
        case "en-GB":
            voice = "Emma"
            break;

        case "it-IT":
            voice = "Bianca"
            break;
        
        case "hi-IN":
            if (getSelEngine = "neural"){
                voice = "Kajal"
            }
            else{
                voice = "Aditi"
            }
            break;

        case "ko-KR":
            voice = "Seoyeon"
            break;

        case "pt-BR":
            voice = "Vitoria"
            break;
        
        case "pt-PT":
            voice = "Ines"
            break;
        
        default:
            voice = "Joanna"
            break;            
    }


    // AWS polly parameters
    var params = {      
        Engine : getSelEngine,
        OutputFormat: "mp3",
        Text: getText,
        TextType: "text",
        LanguageCode : selLang,
        VoiceId: voice
    };

    
    
    polly.synthesizeSpeech(params, function(err, data){
        if (err){
            alert("Error is occured")
            console.log(err, err.stack);
        }
        else{
            $('#divAudioOutPop').modal('show');

            var uInt8Array = new Uint8Array(data.AudioStream);
            var arrayBuffer = uInt8Array.buffer; 
            var blob = new Blob ( [arrayBuffer]);
            var audio= $('audio');
            var url = URL.createObjectURL(blob);
            audio[0].src= url;
            audio [0].play();
        }
    }); 
}

// To pause audio and close popup modal
ats.popPauseClose = function(){
    var audOut = document.getElementById("audOut");
    audOut.pause();

    $('#divAudioOutPop').modal('hide');
}
