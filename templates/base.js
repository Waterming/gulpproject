var Units = (function(){
    function Units(name){
        this.pageName = name;
    }
    Units.prototype.getPageName = function() {
        return this.pageName;
    }
    return Units;
}());