document.addEventListener('DOMContentLoaded',function(){
    var calMonth=document.getElementById('calMonth');
    var calDays=document.getElementById('calendarDays');
    var calPrev=document.getElementById('calPrev');
    var calNext=document.getElementById('calNext');
    if(!calMonth||!calDays)return;
    var now=new Date();
    var currentMonth=now.getMonth();
    var currentYear=now.getFullYear();
    var monthNames=['Januar','Februar','Mart','April','Maj','Jun','Jul','Avgust','Septembar','Oktobar','Novembar','Decembar'];
    var bookings=getBookings();
    function getBookings(){try{return JSON.parse(localStorage.getItem('pgClubBookings'))||[]}catch(e){return[];}}
    function saveBookings(){localStorage.setItem('pgClubBookings',JSON.stringify(bookings));}
    function renderCalendar(){
        calMonth.textContent=monthNames[currentMonth]+' '+currentYear;
        calDays.innerHTML='';
        var firstDay=new Date(currentYear,currentMonth,1).getDay();
        var daysInMonth=new Date(currentYear,currentMonth+1,0).getDate();
        var today=new Date();today.setHours(0,0,0,0);
        var adjustedFirst=(firstDay===0)?6:firstDay-1;
        for(var i=0;i<adjustedFirst;i++){var empty=document.createElement('div');empty.className='cal-day empty';calDays.appendChild(empty);}
        for(var d=1;d<=daysInMonth;d++){
            var dayEl=document.createElement('div');dayEl.className='cal-day';
            var dateStr=currentYear+'-'+String(currentMonth+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
            var dateObj=new Date(currentYear,currentMonth,d);dateObj.setHours(0,0,0,0);
            if(dateObj.getTime()===today.getTime())dayEl.classList.add('today');
            if(dateObj<today){dayEl.classList.add('past');}
            var dayBookings=bookings.filter(function(b){return b.date===dateStr&&b.status!=='odbita';});
            if(dayBookings.length>0){
                dayEl.classList.add('occupied');
                var names=dayBookings.map(function(b){return b.name.split(' ')[0];}).join(', ');
                var tooltip=dayBookings.map(function(b){return b.name+' ('+b.packageName+', '+b.time+')';}).join('\n');
                dayEl.innerHTML='<span class="cal-date">'+d+'</span><span class="cal-booked-name" title="'+tooltip+'">'+names+'</span>';
                if(dateObj>=today)dayEl.title=tooltip;
            }else if(dateObj>=today){
                dayEl.classList.add('available');
                var diffCalc=Math.ceil((dateObj-today)/(1000*60*60*24));
                if(diffCalc<7)dayEl.classList.add('instant');
                dayEl.innerHTML='<span class="cal-date">'+d+'</span>';
                dayEl.addEventListener('click',(function(ds){return function(){openBookingModal(ds);};})(dateStr));
            }else{dayEl.innerHTML='<span class="cal-date">'+d+'</span>';}
            calDays.appendChild(dayEl);
        }
    }
    calPrev.addEventListener('click',function(){currentMonth--;if(currentMonth<0){currentMonth=11;currentYear--;}renderCalendar();});
    calNext.addEventListener('click',function(){currentMonth++;if(currentMonth>11){currentMonth=0;currentYear++;}renderCalendar();});
    renderCalendar();

    var packages={
        'party-squad':{name:'Party Squad',minGuests:10,maxGuests:40,price:43,morningPrice:35,minDaysAdvance:30},
        'classic-night':{name:'Classic Night',minGuests:50,maxGuests:500,price:39,morningPrice:31,minDaysAdvance:7},
        'grand-night':{name:'Grand Night',minGuests:100,maxGuests:500,price:35,morningPrice:27,minDaysAdvance:7},
        'royal-night':{name:'Royal Night',minGuests:150,maxGuests:200,price:33,morningPrice:25,minDaysAdvance:7}
    };

    var INSTANT_SURCHARGE=8;
    var INSTANT_DAYS=7;
    var selectedPackage=null;
    var selectedDate=null;
    var isInstantBooking=false;

    function openModal(id){var m=document.getElementById(id);if(m)m.classList.add('active');}
    function closeModal(id){var m=document.getElementById(id);if(m)m.classList.remove('active');}

    function formatDate(dateStr){
        var parts=dateStr.split('-');
        var d=new Date(parts[0],parts[1]-1,parts[2]);
        var days=['Nedjelja','Ponedjeljak','Utorak','Srijeda','\u010Cetvrtak','Petak','Subota'];
        return days[d.getDay()]+', '+parts[2]+'.'+parts[1]+'.'+parts[0];
    }

    function getDaysDiff(dateStr){
        var bookingDate=new Date(dateStr);
        bookingDate.setHours(0,0,0,0);
        var today=new Date();today.setHours(0,0,0,0);
        return Math.ceil((bookingDate-today)/(1000*60*60*24));
    }

    function openBookingModal(dateStr){
        selectedDate=dateStr;
        var diff=getDaysDiff(dateStr);
        isInstantBooking=diff<INSTANT_DAYS;

        var modal=document.getElementById('bookingModal');
        if(!modal)return;
        var dateDisplay=document.getElementById('bookingDateDisplay');
        var pkgName=document.getElementById('bookingPackageName');
        var pkgPrice=document.getElementById('bookingPackagePrice');
        if(dateDisplay)dateDisplay.textContent=formatDate(dateStr);

        var instantBanner=document.getElementById('instantBanner');
        var instantFormNote=document.getElementById('instantFormNote');
        var submitBtn=document.getElementById('bookingSubmitBtn');

        if(selectedPackage){
            var pkg=packages[selectedPackage];
            if(isInstantBooking){
                var instantPrice=pkg.price+INSTANT_SURCHARGE;
                var instantMorning=pkg.morningPrice+INSTANT_SURCHARGE;
                if(pkgName)pkgName.textContent=pkg.name+' (Instant)';
                if(pkgPrice)pkgPrice.textContent='\u20AC'+instantPrice+' / os (večernji) | \u20AC'+instantMorning+' / os (jutarnji)';
                if(instantBanner)instantBanner.style.display='block';
                if(instantFormNote)instantFormNote.style.display='block';
                if(submitBtn)submitBtn.style.display='none';
            }else{
                if(pkgName)pkgName.textContent=pkg.name;
                if(pkgPrice)pkgPrice.textContent='\u20AC'+pkg.price+' / os (večernji) | \u20AC'+pkg.morningPrice+' / os (jutarnji)';
                if(instantBanner)instantBanner.style.display='none';
                if(instantFormNote)instantFormNote.style.display='none';
                if(submitBtn)submitBtn.style.display='flex';
            }
        }
        document.getElementById('bookingDate').value=dateStr;
        if(selectedPackage)document.getElementById('bookingPackage').value=selectedPackage;
        updatePriceSummary();
        openModal('bookingModal');
    }

    function getMinAdvanceText(pkg){
        if(pkg==='party-squad')return 'Minimalno 30 dana unaprijed';
        return 'Minimalno 7 dana unaprijed';
    }

    document.querySelectorAll('.btn-book').forEach(function(btn){
        btn.addEventListener('click',function(){
            selectedPackage=this.getAttribute('data-package');
            var infoEl=document.getElementById('modalMinAdvance');
            if(infoEl){
                var pkg=packages[selectedPackage];
                infoEl.textContent=getMinAdvanceText(selectedPackage)+' (od '+pkg.minDaysAdvance+' dana)';
            }
            openModal('calendarModal');
        });
    });

    document.querySelectorAll('.modal-close-btn').forEach(function(btn){
        btn.addEventListener('click',function(){var m=this.closest('.booking-modal');if(m)m.classList.remove('active');});
    });

    var bookingForm=document.getElementById('bookingForm');
    if(bookingForm){
        bookingForm.addEventListener('submit',function(e){
            e.preventDefault();
            if(isInstantBooking){
                alert('Instant rezervacija nije moguća preko sajta.\nMolimo pozovite nas: +382 XX XXX XXX');
                return;
            }
            var name=document.getElementById('bookingName').value.trim();
            var surname=document.getElementById('bookingSurname').value.trim();
            var jmbg=document.getElementById('bookingJMBG').value.trim();
            var phone=document.getElementById('bookingPhone').value.trim();
            var email=document.getElementById('bookingEmail').value.trim();
            var eventType=document.getElementById('bookingEventType').value;
            var guests=document.getElementById('bookingGuests').value;
            var pkg=document.getElementById('bookingPackage').value;
            var date=document.getElementById('bookingDate').value;
            var timeSlot=document.getElementById('bookingTimeSlot').value;
            var addonSnack=document.getElementById('bookingAddonSnack');
            var addonMeza=document.getElementById('bookingAddonMeza');

            if(!name||!surname||!jmbg||!phone||!email||!eventType||!guests||!pkg||!date||!timeSlot){
                alert('Molimo popunite sva polja.');return;
            }
            if(jmbg.length!==13||!/^\d{13}$/.test(jmbg)){
                alert('JMBG mora imati tačno 13 cifara.');return;
            }

            var pkgData=packages[pkg];
            if(pkgData){
                var g=parseInt(guests);
                if(g<pkgData.minGuests){alert('Minimalan broj gostiju za paket '+pkgData.name+' je '+pkgData.minGuests+'.');return;}
                if(pkgData.maxGuests&&g>pkgData.maxGuests){alert('Maksimalan broj gostiju za paket '+pkgData.name+' je '+pkgData.maxGuests+'.');return;}
            }

            var selectedAddons=[];var addonTotal=0;
            if(addonSnack&&addonSnack.checked){selectedAddons.push({name:'Grickalice',pricePerPerson:2});addonTotal+=2*parseInt(guests);}
            if(addonMeza&&addonMeza.checked){selectedAddons.push({name:'Meza, masline i sir',pricePerPerson:4});addonTotal+=4*parseInt(guests);}

            var fullName=name+' '+surname;
            var basePrice=timeSlot==='morning'?pkgData.morningPrice:pkgData.price;
            var totalPrice=(basePrice*parseInt(guests))+addonTotal;
            var advanceAmount=Math.round(totalPrice*0.5*100)/100;

            bookings.push({
                name:fullName,jmbg:jmbg,phone:phone,email:email,eventType:eventType,
                guests:guests,package:pkg,packageName:pkgData?pkgData.name:pkg,
                date:date,time:timeSlot==='morning'?'09:00-15:00':'18:00-02:00',
                timeSlot:timeSlot,addons:selectedAddons,basePricePerPerson:basePrice,
                totalPrice:totalPrice,advanceAmount:advanceAmount,isInstant:false,
                status:'cekanje',timestamp:new Date().toISOString()
            });
            saveBookings();
            closeModal('bookingModal');
            showBookingSuccess(fullName,date,timeSlot==='morning'?'09:00 - 15:00':'18:00 - 02:00',advanceAmount);
            renderCalendar();
            bookingForm.reset();
            updatePriceSummary();
        });
    }

    function updatePriceSummary(){
        var guests=document.getElementById('bookingGuests');
        var timeSlot=document.getElementById('bookingTimeSlot');
        var pkg=document.getElementById('bookingPackage');
        var addonSnack=document.getElementById('bookingAddonSnack');
        var addonMeza=document.getElementById('bookingAddonMeza');
        var priceBase=document.getElementById('priceBase');
        var priceAddons=document.getElementById('priceAddons');
        var priceAddonsRow=document.getElementById('priceAddonsRow');
        var priceTotal=document.getElementById('priceTotal');
        var priceAdvance=document.getElementById('priceAdvance');
        var priceInstantNote=document.getElementById('priceInstantNote');

        var g=parseInt(guests?guests.value:0)||0;
        var pkgKey=pkg?pkg.value:'';
        var pkgData=packages[pkgKey];
        var time=timeSlot?timeSlot.value:'';

        if(!pkgData||g===0||!time){
            if(priceBase)priceBase.textContent='\u20AC0';
            if(priceAddons)priceAddons.textContent='\u20AC0';
            if(priceAddonsRow)priceAddonsRow.style.display='none';
            if(priceTotal)priceTotal.textContent='\u20AC0';
            if(priceAdvance)priceAdvance.textContent='\u20AC0';
            if(priceInstantNote)priceInstantNote.style.display='none';
            return;
        }

        var basePerPerson=time==='morning'?pkgData.morningPrice:pkgData.price;
        if(isInstantBooking)basePerPerson+=INSTANT_SURCHARGE;
        var baseTotal=basePerPerson*g;
        var addonTotal=0;
        if(addonSnack&&addonSnack.checked)addonTotal+=2*g;
        if(addonMeza&&addonMeza.checked)addonTotal+=4*g;

        var total=baseTotal+addonTotal;
        var advance=Math.round(total*0.5*100)/100;

        if(priceBase)priceBase.textContent='\u20AC'+baseTotal;
        if(addonTotal>0){
            if(priceAddons)priceAddons.textContent='\u20AC'+addonTotal;
            if(priceAddonsRow)priceAddonsRow.style.display='flex';
        }else{
            if(priceAddonsRow)priceAddonsRow.style.display='none';
        }
        if(priceTotal)priceTotal.textContent='\u20AC'+total;
        if(priceAdvance)priceAdvance.textContent='\u20AC'+advance;
        if(priceInstantNote)priceInstantNote.style.display=isInstantBooking?'block':'none';
    }

    ['bookingGuests','bookingTimeSlot','bookingAddonSnack','bookingAddonMeza'].forEach(function(id){
        var el=document.getElementById(id);
        if(el){el.addEventListener('input',updatePriceSummary);el.addEventListener('change',updatePriceSummary);}
    });

    function showBookingSuccess(name,date,time,advance){
        var successModal=document.getElementById('successModal');
        if(successModal){
            var info=document.getElementById('successInfo');
            if(info)info.innerHTML='<strong>'+name+'</strong><br>Datum: '+formatDate(date)+'<br>Termin: '+time+'<br><br><div class="success-advance"><i class="fas fa-info-circle"></i> Rezervacija je besplatna. Za potvrdu je potrebno uplatiti <strong>50% avansa</strong> (€'+advance+'). Uskoro \u0107emo vas kontaktirati telefonom radi obja\u0161njenja procedure uplate.</div><div class="success-rules"><i class="fas fa-ban"></i> Uno\u0161enje alkohola i hrane u klub je zabranjeno.</div>';
            openModal('successModal');
        }else{
            alert('Rezervacija uspje\u0161na!\n\nIme: '+name+'\nDatum: '+formatDate(date)+'\nTermin: '+time+'\nAvans: €'+advance+'\n\nUskoro \u0107emo vas kontaktirati.');
        }
    }

    ['calendarModal','bookingModal','successModal'].forEach(function(id){
        var m=document.getElementById(id);
        if(m)m.addEventListener('click',function(e){if(e.target===m)m.classList.remove('active');});
    });
});
