$ipbasebin = [];
$ipbasedec = [];
$maskbin = [];
$maskdec = [];
$iprangedec = [];
$iprange = "";

function getIpRange(ip, cidr) {
    let part = [ip, cidr]; // part[0] = base address, part[1] = netmask
    let ipaddress = part[0].split('.');
    let netmaskblocks = ["0", "0", "0", "0"];
    if (!/\d+\.\d+\.\d+\.\d+/.test(part[1])) {
        // part[1] has to be between 0 and 32
        netmaskblocks = ("1".repeat(parseInt(part[1], 10)) + "0".repeat(32 - parseInt(part[1], 10))).match(/.{1,8}/g);
        netmaskblocks = netmaskblocks.map(function(el) { return parseInt(el, 2); });
    } else {
        // xxx.xxx.xxx.xxx
        netmaskblocks = part[1].split('.').map(function(el) { return parseInt(el, 10) });
    }
    // invert for creating broadcast address (highest address)
    let invertedNetmaskblocks = netmaskblocks.map(function(el) { return el ^ 255; });
    let netip = ipaddress.map(function(block, idx) { return block & netmaskblocks[idx]; });
    let broadcastip = netip.map(function(block, idx) { return block | invertedNetmaskblocks[idx]; });
    return [netip.join('.'), broadcastip.join('.')];
}

function getNetClass(firstipbyte) { 
    if (firstipbyte >= 1 && firstipbyte <= 126) {
        return 'Classe A';
    } else if (firstipbyte == 127) {
        return 'Adresse de bouclage local';
    } else if (firstipbyte >= 128 && firstipbyte <= 191) {
        return 'Classe B';
    } else if (firstipbyte >= 192 && firstipbyte <= 223) {
        return 'Classe C';
    } else if (firstipbyte >= 224 && firstipbyte <= 239) {
        return 'Classe D';
    } else if (firstipbyte >= 240 && firstipbyte <= 255) {
        return 'Classe E';
    } else {
        return 'Classe inconnue';
    }
}

function getNbOfHosts(cidr) {
    nb = Math.pow(2, 32 - cidr) - 2;
    return nb + " hôtes";
}

function debug($content) {
    console.log($content);
}

function init() {
    disableIpDiv();
    disableMaskDiv();
    disableIpRangeDiv();
}

function refreshData() {
    //conversion décimal et binaire IP
    for (bytes = 0; bytes <= 3; bytes++) { //affectation des valeurs de l'html à $ipbasedec
        if (document.getElementById(bytes + 'ipbasebyte10').value >= 0 && document.getElementById(bytes + 'ipbasebyte10').value <= 255) {
            $ipbasedec[bytes] = Math.trunc(document.getElementById(bytes + 'ipbasebyte10').value);
        } else if (document.getElementById(bytes + 'ipbasebyte10').value < 0) {
            document.getElementById(bytes + 'ipbasebyte10').value = 0;
            $ipbasedec[bytes] = 0;
        } else {
            document.getElementById(bytes + 'ipbasebyte10').value = 255;
            $ipbasedec[bytes] = 255;
        }
    }
    for (bytes = 0; bytes <= 3; bytes++) { //affectation des valeurs de l'html à $ipbasebin
        if (document.getElementById(bytes + 'ipbasebyte2').value >= 0 && document.getElementById(bytes + 'ipbasebyte2').value <= 11111111) {
            $ipbasebin[bytes] = Math.trunc(document.getElementById(bytes + 'ipbasebyte2').value);
        } else if (document.getElementById(bytes + 'ipbasebyte2').value < 0) {
            document.getElementById(bytes + 'ipbasebyte2').value = 0;
            $ipbasebin[bytes] = 0;
        } else {
            document.getElementById(bytes + 'ipbasebyte2').value = 11111111;
            $ipbasebin[bytes] = 11111111;
        }
    }
    //conversion décimal et binaire Masque
    for (bytes = 0; bytes <= 3; bytes++) { //affectation des valeurs de l'html à $maskdec
        if (document.getElementById(bytes + 'maskbyte10').value >= 0 && document.getElementById(bytes + 'maskbyte10').value <= 255) {
            $maskdec[bytes] = Math.trunc(document.getElementById(bytes + 'maskbyte10').value);
        } else if (document.getElementById(bytes + 'maskbyte10').value < 0) {
            document.getElementById(bytes + 'maskbyte10').value = 0;
            $maskdec[bytes] = 0;
        } else {
            document.getElementById(bytes + 'maskbyte10').value = 255;
            $maskdec[bytes] = 255;
        }
    }
    for (bytes = 0; bytes <= 3; bytes++) { //affectation des valeurs de l'html à $maskbin
        if (document.getElementById(bytes + 'maskbyte2').value >= 0 && document.getElementById(bytes + 'maskbyte2').value <= 11111111) {
            $maskbin[bytes] = Math.trunc(document.getElementById(bytes + 'maskbyte2').value);
        } else if (document.getElementById(bytes + 'maskbyte2').value < 0) {
            document.getElementById(bytes + 'maskbyte2').value = 0;
            $maskbin[bytes] = 0;
        } else {
            document.getElementById(bytes + 'maskbyte2').value = 11111111;
            $maskbin[bytes] = 11111111;
        }
    }
    for (bytes = 0; bytes <= 3; bytes++) { //affectation des valeurs de l'html à $iprangedec
        if (document.getElementById(bytes + 'iprangebyte10').value >= 0 && document.getElementById(bytes + 'iprangebyte10').value <= 255) {
            $iprangedec[bytes] = Math.trunc(document.getElementById(bytes + 'iprangebyte10').value);
        } else if (document.getElementById(bytes + 'iprangebyte10').value < 0) {
            document.getElementById(bytes + 'iprangebyte10').value = 0;
            $iprangedec[bytes] = 0;
        } else {
            document.getElementById(bytes + 'iprangebyte10').value = 255;
            $iprangedec[bytes] = 255;
        }
    }
    if (document.getElementById('mode_ip10to2').checked) {
        for (bytes = 0; bytes < 4; bytes++) {
            $ipbasebin[bytes] = parseInt($ipbasedec[bytes]).toString(2);
            $bitstoadd = 8 - document.getElementById(bytes + 'ipbasebyte2').value.length;
            for (i = 0; i < $bitstoadd; i++) {
                $ipbasebin[bytes] = "0" + $ipbasebin[bytes];
            }
            document.getElementById(bytes + 'ipbasebyte2').value = $ipbasebin[bytes];
        }
    } else if (document.getElementById('mode_ip2to10').checked) {
        for (bytes = 0; bytes < 4; bytes++) {
            $ipbasedec[bytes] = parseInt($ipbasebin[bytes], 2).toFixed(0);
            document.getElementById(bytes + 'ipbasebyte10').value = $ipbasedec[bytes];
        }
    } else if (document.getElementById('mode_mask2to10').checked) {
        for (bytes = 0; bytes < 4; bytes++) {
            $maskdec[bytes] = parseInt($maskbin[bytes], 2).toFixed(0);
            document.getElementById(bytes + 'maskbyte10').value = $maskdec[bytes];
        }
    } else if (document.getElementById('mode_mask10to2').checked) {
        for (bytes = 0; bytes < 4; bytes++) {
            $maskbin[bytes] = parseInt($maskdec[bytes]).toString(2);
            document.getElementById(bytes + 'maskbyte2').value = $maskbin[bytes];
        }
    } else if (document.getElementById('mode_iprange').checked) {
        $cidrrange = document.getElementById('cidr').value;
        $netclass = getNetClass($iprangedec[0]);
        for (bytes = 0; bytes < 4; bytes++) {
            $iprange = $iprangedec.join('.');
            document.getElementById(bytes + 'netiprangebyte10').value = getIpRange($iprange, $cidrrange)[0].split('.')[bytes];
            document.getElementById(bytes + 'briprangebyte10').value = getIpRange($iprange, $cidrrange)[1].split('.')[bytes];
            document.getElementById('netclass').value = $netclass;
            document.getElementById('nbofhosts').value = getNbOfHosts($cidrrange);
        }
    }
}
//==========ENABLE AND DISABLE SECTION==========//
//Divs
function enableIpDiv() {
    document.getElementById('ipbase').style.display = "";
}

function disableIpDiv() {
    document.getElementById('ipbase').style.display = "none";
}

function enableMaskDiv() {
    document.getElementById('maskbase').style.display = "";
}

function disableMaskDiv() {
    document.getElementById('maskbase').style.display = "none";
}

function enableIpRangeDiv() {
    document.getElementById('iprange').style.display = "";
}

function disableIpRangeDiv() {
    document.getElementById('iprange').style.display = "none";
}
//IP
function disableIpBinInput() {
    document.querySelectorAll('input.ipbasebin').forEach(input => input.disabled = true);
    document.querySelectorAll('input.ipbasebin').forEach(input => input.style.color = 'green');
    document.querySelectorAll('input.ipbasebin').forEach(input => input.style.fontWeight = 'bold');
    document.querySelectorAll('input.ipbasebin').forEach(input => input.value = "0");
}

function enableIpBinInput() {
    document.querySelectorAll('input.ipbasebin').forEach(input => input.disabled = false);
    document.querySelectorAll('input.ipbasebin').forEach(input => input.style.color = 'black');
    document.querySelectorAll('input.ipbasebin').forEach(input => input.style.fontWeight = 'normal');
    document.querySelectorAll('input.ipbasebin').forEach(input => input.value = "0");
}

function disableIpDecInput() {
    document.querySelectorAll('input.ipbasedec').forEach(input => input.disabled = true);
    document.querySelectorAll('input.ipbasedec').forEach(input => input.style.color = 'green');
    document.querySelectorAll('input.ipbasedec').forEach(input => input.style.fontWeight = 'bold');
    document.querySelectorAll('input.ipbasedec').forEach(input => input.value = "0");
}

function enableIpDecInput() {
    document.querySelectorAll('input.ipbasedec').forEach(input => input.disabled = false);
    document.querySelectorAll('input.ipbasedec').forEach(input => input.style.color = 'black');
    document.querySelectorAll('input.ipbasedec').forEach(input => input.style.fontWeight = 'normal');
    document.querySelectorAll('input.ipbasedec').forEach(input => input.value = "0");
}
//Mask 
function disableMaskBinInput() {
    document.querySelectorAll('input.maskbin').forEach(input => input.disabled = true);
    document.querySelectorAll('input.maskbin').forEach(input => input.style.color = 'green');
    document.querySelectorAll('input.maskbin').forEach(input => input.style.fontWeight = 'bold');
    document.querySelectorAll('input.maskbin').forEach(input => input.value = "0");
}

function enableMaskBinInput() {
    document.querySelectorAll('input.maskbin').forEach(input => input.disabled = false);
    document.querySelectorAll('input.maskbin').forEach(input => input.style.color = 'black');
    document.querySelectorAll('input.maskbin').forEach(input => input.style.fontWeight = 'normal');
    document.querySelectorAll('input.maskbin').forEach(input => input.value = "0");
}

function disableMaskDecInput() {
    document.querySelectorAll('input.maskdec').forEach(input => input.disabled = true);
    document.querySelectorAll('input.maskdec').forEach(input => input.style.color = 'green');
    document.querySelectorAll('input.maskdec').forEach(input => input.style.fontWeight = 'bold');
    document.querySelectorAll('input.maskdec').forEach(input => input.value = "0");
}

function enableMaskDecInput() {
    document.querySelectorAll('input.maskdec').forEach(input => input.disabled = false);
    document.querySelectorAll('input.maskdec').forEach(input => input.style.color = 'black');
    document.querySelectorAll('input.maskdec').forEach(input => input.style.fontWeight = 'normal');
    document.querySelectorAll('input.maskdec').forEach(input => input.value = "0");
}