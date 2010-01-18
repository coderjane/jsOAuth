function OAuthConsumer(key, secret, token, token_secret) {
    var parent = OAuthConsumer.prototype;
    
    this.init = function(key, secret, token, token_secret) {
        this.key = key || '';
        this.secret = secret || '';
        this.token = token || '';
        this.token_secret = token_secret || '';
        
        parent.init.apply(this, arguments);
    };
    
    this.requestToken = function(){
        // create a header
        var request_params = {
            'oauth_callback':'',
            'oauth_consumer_key': this.key,
            'oauth_token': this.token,
            'oauth_signature_method': SIGNATURE_METHOD,
            'oauth_timestamp': this.getTimestamp(),
            'oauth_nonce': this.getNonce(),
            'oauth_verifier': '',
            'oauth_signature': (
                new OAuthConsumer.signatureMethods[SIGNATURE_METHOD]
             ).sign(this.secret, this.token_secret),
            'oauth_version': VERSION
        };
        var request_header = [];
        var request = [];
        var header = '';
        var xhr;
        var url;
        
        for (var i in request_params) {
            if (request_params.hasOwnProperty(i)) {
                request_header.push(OAuthUtilities.urlEncode(i) + '="' 
                    + OAuthUtilities.urlEncode(request_params[i]) + '"');
                request.push(OAuthUtilities.urlEncode(i) + '=' 
                    + OAuthUtilities.urlEncode(request_params[i]));
            }
        }
        
        header = 'OAuth realm="' + this.realm + '",' + request_header.join(',');
        url = this.requestTokenUrl + '?' + request.join('&');
        xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.setRequestHeader('Authorization', header);
        xhr.send(null);
        alert(xhr.responseText);
    };
    
    this.getTimestamp = function() {
        return parseInt((new Date).getTime() / 1000) + '';
    };
    
    this.getNonce = function(key_length){
        key_length = key_length || 64;
        
        var key_bytes = key_length / 8;
        var value = '';
        var key_iter = key_bytes / 4;
        var key_remainder = key_bytes % 4;
        var chars = ['20', '21', '22', '23', '24', '25', '26', '27', '28', '29', 
                     '2A', '2B', '2C', '2D', '2E', '2F', '30', '31', '32', '33', 
                     '34', '35', '36', '37', '38', '39', '3A', '3B', '3C', '3D', 
                     '3E', '3F', '40', '41', '42', '43', '44', '45', '46', '47', 
                     '48', '49', '4A', '4B', '4C', '4D', '4E', '4F', '50', '51', 
                     '52', '53', '54', '55', '56', '57', '58', '59', '5A', '5B', 
                     '5C', '5D', '5E', '5F', '60', '61', '62', '63', '64', '65', 
                     '66', '67', '68', '69', '6A', '6B', '6C', '6D', '6E', '6F', 
                     '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', 
                     '7A', '7B', '7C', '7D', '7E'];
        
        for (var i = 0; i < key_iter; i++) {
            value += chars[rand()] + chars[rand()] + chars[rand()]+ chars[rand()];
        }
        
        // handle remaing bytes
        for (var i = 0; i < key_remainder; i++) {
            value += chars[rand()];
        }
        
        return value;
        
        function rand() {
            return Math.floor(Math.random() * chars.length);
        }
    }
    
    if (arguments.length > 0) {
        this.init(key, secret, token, token_secret);
    }
}

OAuthConsumer.signatureMethods = {};

OAuthConsumer.prototype = new OAuthConsumerAbstract();