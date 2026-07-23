const DEFAULT_DATA={
    site:{name:"PG Club",tagline:"Premium Klubske Proslave",location:"Podgorica, Crna Gora",address:"Rasko Trg",description:"PG Club je novo premium mjesto za privatne klubske proslave u Podgorici.",email:"info@pgclub.me",phone:"+382 XX XXX XXX"},
    opening:{date:"2026-09-15",label:"Grand Opening 15.09.2026"},
    hours:{javni:"18:00 - 03:00",privatni:"18:00 - 02:00",jutarnji:"09:00 - 15:00"},
    about:{title:"O Clubu",subtitle:"Dobrodošli u PG Club",text1:"PG Club je novo premium mjesto za privatne klubske proslave u Podgorici, smješten na Raskom Trgu.",text2:"Fokusirani smo na klubskе privatnе proslavе — rođendane, proslave firmi, momačke i djevojačke večeri, promocije i druge zabave.",capacity:"250",vipBoxes:"4",drinks:"50"},
    packages:[
        {id:"party-squad",name:"Party Squad",price:43,morningPrice:35,minGuests:10,maxGuests:40,time:"18:00-02:00",description:"Mešovite grupe, više rezervacija istovremeno",includes:["10-40 gostiju","Mešovite grupe","Obezbjeđenje","DJ","Neograničeno piće"],featured:true},
        {id:"classic-night",name:"Classic Night",price:39,morningPrice:31,minGuests:50,maxGuests:500,time:"18:00-02:00",description:"Privatna proslava",includes:["Minimalno 50 gostiju","Privatna proslava","Obezbjeđenje","DJ","Neograničeno piće"],featured:false},
        {id:"grand-night",name:"Grand Night",price:35,morningPrice:27,minGuests:100,maxGuests:500,time:"18:00-02:00",description:"Premium paket sa pjevačem",includes:["Minimalno 100 gostiju","Privatna proslava","Obezbjeđenje","DJ","Neograničeno piće","Lokalni pjevač","5L besplatne dobrodošlice"],featured:false},
        {id:"royal-night",name:"Royal Night",price:33,morningPrice:25,minGuests:150,maxGuests:200,time:"18:00-02:00",description:"Najveći paket",includes:["150-200 gostiju","Privatna proslava","Obezbjeđenje","DJ","Neograničeno piće","Lokalni pjevač","5L besplatne dobrodošlice"],featured:false}
    ],
    events:[
        {title:"Grand Opening",description:"Spektakularno otvaranje PG Club-a sa posebnim gostima i iznenađenjima.",date:"15",month:"SEP",badge:"Grand Opening",time:"22:00 - 05:00",featured:true},
        {title:"Halloween Party",description:"Maskembal najvećeg formata. Pripremite svoje najkreativnije kostime.",date:"TBD",month:"OKT",badge:"Tema",time:"22:00 - 04:00",featured:false},
        {title:"New Year's Eve",description:"Najluđa noć u godini provedite u PG Club-u.",date:"31",month:"DEC",badge:"Specijalno",time:"21:00 - 06:00",featured:false}
    ],
    gallery:[],
    social:{instagram:"#",facebook:"#",tiktok:"#",twitter:"#"}
};

function getSiteData(){
    return JSON.parse(localStorage.getItem('pgClubData'))||JSON.parse(JSON.stringify(DEFAULT_DATA));
}

function setVal(el,value){
    if(el)el.textContent=value;
}

function setAttr(el,attr,value){
    if(el)el.setAttribute(attr,value);
}

function loadSiteContent(){
    var d=getSiteData();
    
    document.title=d.site.name+" - Podgorica";
    
    var badge=document.querySelector('.hero-badge span');
    if(badge)badge.textContent=d.site.location;
    
    var tagline=document.querySelector('.tagline');
    if(tagline)tagline.textContent=d.site.tagline;
    
    var countdownDate=document.querySelector('.countdown-date');
    if(countdownDate)countdownDate.textContent=d.opening.label;
    
    var marqueeSpans=document.querySelectorAll('.marquee-content span');
    if(marqueeSpans.length>0){
        marqueeSpans[0].textContent="\u2605 "+d.opening.label;
        if(marqueeSpans[5])marqueeSpans[5].textContent="\u2605 "+d.opening.label;
    }
    
    var aboutSubtitle=document.querySelector('.about-subtitle');
    if(aboutSubtitle)aboutSubtitle.textContent=d.about.subtitle;
    
    var aboutTexts=document.querySelectorAll('.about-text');
    if(aboutTexts[0])aboutTexts[0].textContent=d.about.text1;
    if(aboutTexts[1])aboutTexts[1].textContent=d.about.text2;
    
    var statNumbers=document.querySelectorAll('.stat-number');
    if(statNumbers[0])statNumbers[0].setAttribute('data-count',d.about.capacity);
    if(statNumbers[1])statNumbers[1].setAttribute('data-count',d.about.vipBoxes);
    if(statNumbers[2])statNumbers[2].setAttribute('data-count',d.about.drinks);
    
    var parallaxH2=document.querySelector('.parallax-content h2');
    if(parallaxH2)parallaxH2.textContent='\u201CNo\u0107 Je Mlada\u201D';
    var parallaxP=document.querySelector('.parallax-content p');
    if(parallaxP)parallaxP.textContent="Do\u017Eivite magiju "+d.site.name+"-a";
    
    var eventsGrid=document.querySelector('.events-grid');
    if(eventsGrid){
        eventsGrid.innerHTML='';
        d.events.forEach(function(e,i){
            var featured=e.featured?'featured':'';
            eventsGrid.innerHTML+='<div class="event-card '+featured+'" data-aos="fade-up" data-aos-delay="'+((i+1)*100)+'"><div class="event-content"><div class="event-date"><span class="day">'+e.date+'</span><span class="month">'+e.month+'</span></div><h3>'+e.title+'</h3><p>'+e.description+'</p><div class="event-meta"><span><i class="fas fa-clock"></i> '+e.time+'</span><span><i class="fas fa-map-marker-alt"></i> '+d.site.location+'</span></div><a href="#kontakt" class="btn btn-secondary btn-sm"><span>Vi\u0161e Informacija</span></a></div></div>';
        });
    }
    
    var galleryGrid=document.querySelector('.gallery-grid');
    if(galleryGrid){
        galleryGrid.innerHTML='';
        if(d.gallery&&d.gallery.length>0){
            d.gallery.forEach(function(g,i){
                var large=i===0?'large':'';
                galleryGrid.innerHTML+='<div class="gallery-item '+large+'" data-category="'+g.category+'"><img src="'+g.url+'" alt="'+g.title+'"><div class="gallery-overlay"><i class="fas fa-expand"></i><span>'+g.title+'</span></div></div>';
            });
        }else{
            galleryGrid.innerHTML='<p style="text-align:center;color:#888;grid-column:1/-1;padding:40px 0;">Galerija uskoro - pratite naše društvene mreže</p>';
        }
    }
    
    var contactLocation=document.querySelectorAll('.contact-details p');
    if(contactLocation[0])contactLocation[0].innerHTML=d.site.address+'<br>'+d.site.location;
    if(contactLocation[1])contactLocation[1].innerHTML='Javni partyji: '+d.hours.javni+'<br>Privatne proslave: '+d.hours.privatni+'<br>Jutarnji termini: '+d.hours.jutarnji;
    if(contactLocation[2])contactLocation[2].textContent=d.site.phone;
    if(contactLocation[3])contactLocation[3].textContent=d.site.email;
    
    document.querySelectorAll('.footer-contact li').forEach(function(li){
        var icon=li.querySelector('i');
        if(icon&&icon.classList.contains('fa-map-marker-alt'))li.innerHTML='<i class="fas fa-map-marker-alt"></i> '+d.site.address;
        if(icon&&icon.classList.contains('fa-phone'))li.innerHTML='<i class="fas fa-phone"></i> '+d.site.phone;
        if(icon&&icon.classList.contains('fa-envelope'))li.innerHTML='<i class="fas fa-envelope"></i> '+d.site.email;
    });
    
    var footerBrand=document.querySelector('.footer-brand p');
    if(footerBrand)footerBrand.textContent='Va\u0161e mjesto za vrhunski no\u010dni \u017eivot u Podgorici.';
    
    var footerCopy=document.querySelector('.footer-bottom p');
    if(footerCopy)footerCopy.innerHTML='&copy; 2026 '+d.site.name+'. Sva prava zadr\u017eana.';
    
    var socialLinks=document.querySelectorAll('.contact-social .social-link');
    if(socialLinks[0])socialLinks[0].href=d.social.instagram;
    if(socialLinks[1])socialLinks[1].href=d.social.facebook;
    if(socialLinks[2])socialLinks[2].href=d.social.tiktok;
    if(socialLinks[3])socialLinks[3].href=d.social.twitter;
    
    var footerSocialLinks=document.querySelectorAll('.footer-social a');
    if(footerSocialLinks[0])footerSocialLinks[0].href=d.social.instagram;
    if(footerSocialLinks[1])footerSocialLinks[1].href=d.social.facebook;
    if(footerSocialLinks[2])footerSocialLinks[2].href=d.social.tiktok;
    if(footerSocialLinks[3])footerSocialLinks[3].href=d.social.twitter;
}

document.addEventListener('DOMContentLoaded',function(){
    loadSiteContent();
});
