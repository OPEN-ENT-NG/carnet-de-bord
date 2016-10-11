// var basePath = skin.basePath + '../../widgets/carnet-de-bord/';
//
// var widget = model.widgets.findWidget("carnet-de-bord");
//
// //http().get(basePath + 'js/' + model.me.type.toLowerCase() + '.js').done(function(data){
// http().get('/sso/pronote').done(function(data){
//
//     var f = new Function('widget', data);
//     f(widget);
//     console.log(data);
// })


var widget = model.widgets.findWidget("carnet-de-bord");
widget.model = model;

widget.getTag = function(tagName, xml){
    return $(xml).find(tagName).text()
}


widget.contentTypes = [
    {
        title: "lateness",
        icon: "timer-off",
        compact: "",
        full: [],
        getContent: function(eleve){

            var that = this
            delays = $(eleve).find('Retard Justifie')
            var latedate = false;
            allDelays = []

            if (delays) {
                delays.each(function(i, delay){
                    if($(delay).text() === 'false'){
                        latedate = $(delay).parent().find('Date').text()
                        latedate = moment(latedate);
                        latedate = lang.translate('logBook.the')+" "+latedate.format('DD/MM/YYYY - HH:mm');
                        allDelays.push({
                            value : latedate
                        });
                        that.compact = allDelays[0].value

                    }
                })
                that.full = allDelays
            }
       },
        lightboxTitle: "logBook.lateness.all"
    },
    {
        title: "absences",
        icon: "nobody",
        compact: "",
        full: [],
        getContent: function(eleve){

            var that = this
            var allAbsences = []

            absences = $(eleve).find('Absence Justifie')

            if(absences){
                absences.each(function(i, absence){

                    if($(absence).text() === 'false'){

                        if($(absence).parent().find('EstOuverte').text()==="false"){
                            // du... au...
                            startdate = $(absence).parent().find('DateDebut').text();
                            enddate = $(absence).parent().find('DateFin').text();
                            startdate = moment(startdate);
                            enddate = moment(enddate);
                            startdate = startdate.format('DD/MM/YYYY HH:mm');
                            enddate = enddate.format('DD/MM/YYYY HH:mm');

                            absDate = lang.translate('logBook.from')+" "+startdate +" "+lang.translate('logBook.to')+" "+enddate;
                        }else {
                            absDate = $(absence).parent().find('DateDebut').text()
                            absDate = moment(absDate);
                            absDate = absDate.format('DD/MM/YYYY HH:mm');
                            absDate = lang.translate('logBook.the')+" "+  absDate;
                        }
                    }
                    allAbsences.push({
                        value : absDate
                    });
                    that.compact = allAbsences[0].value

                })
                that.full = allAbsences
            }

        },
        lightboxTitle: "logBook.absences.all"
    },
    {
        title: "grades",
        icon: "grades",
        compact: "",
        full: [],
        getContent: function(eleve){

            var that = this
            var allGrades = []

            var isnote = $(eleve).find('PageReleveDeNotes Devoir Note').text();
            if(isnote){
                var lastNotes = $(eleve).find('PageReleveDeNotes Devoir')

                lastNotes.each(function(i, result){
                    note = $(result).find('Note').text();
                    bareme = $(result).find('Bareme').text();
                    matiere = $(result).find('Matiere').text();
                    notedate = moment($(result).find('Date').text());
                    notedate = notedate.format('DD/MM/YYYY');
                    grade = note+"/"+bareme+" "+lang.translate('logBook.in')+" "+matiere+" "+lang.translate('logBook.the')+" "+notedate;

                    allGrades.push({
                        value : grade
                    });
                    that.compact = allGrades[0].value

                })
                that.full = allGrades
            }

        },
        lightboxTitle: "logBook.grades.all"
    },
    {
        title: "diary",
        icon: "homeworks",
        compact: "",
        full: [],
        getContent: function(eleve, compact){

            var that = this
            var allWorks = []

            var iswork = $(eleve).find('PageCahierDeTextes CahierDeTextes TravailAFaire Descriptif').text()
            if (iswork) {

                var diaries = $(eleve).find('PageCahierDeTextes CahierDeTextes');
                $(diaries).each(function(i, diary){
                    if ($(diary).find('TravailAFaire Descriptif').text()) {

                        var matiere = lang.translate('logBook.new.homework')+" "+$(diary).find('Matiere').text()
                        var works = $(diary).find('TravailAFaire');
                        var subsections = []

                        $(works).each(function(i, work){

                            var matiereFirst = $(work).parent().find('Matiere').text()
                            var delivdate = moment($(work).find('PourLe').text())
                            delivdate = delivdate.format('DD/MM/YYYY');
                            delivdate = lang.translate('logBook.for')+" "+delivdate
                            var descr = $(work).find('Descriptif').text();

                            subsections.push({
                                header: delivdate,
                                content: descr
                            })
                        })

                        allWorks.push({
                            value: matiere,
                            subsections: subsections
                        });
                        that.compact = allWorks[0].value+" "+allWorks[0].subsections[0].header
                    }
                })

                that.full = allWorks
            }
        },
        lightboxTitle: "logBook.diary.all"
    },
    {
        title: "skills",
        icon: "trending-up",
        compact: "",
        full: [],
        getContent: function(eleve){

            var that = this
            var allSkills = []
            var subsections = []

            var isSkill = $(eleve).find('PageCompetences Competence').text();
//  !!! if Item
            if (isSkill) {
                var skills = $(eleve).find('PageCompetences Competence').parent()
                skills.each(function(i, skill){
                    if ($(skill).find('Libelle').text()==="Acquis") {
                        var title = $(skill).find('Intitule').text()
                        var competence = $(skill).find('Competence').text()+" "
                        var item = $(skill).find('Item').text()+" "

                        var matiere = $(skill).find('Matiere').text()
                        var skillDate = moment($(skill).find('Date').text());
                        skillDate = skillDate.format('DD/MM/YYYY');

                        //var lastSkill = lang.translate('logBook.the')+" "+skillDate

                        var headskill = lang.translate('logBook.skills')+" "
                        var headitem = lang.translate('logBook.skills.item')+" "

                        var fullTitle = title +" "+lang.translate('logBook.the')+" "+skillDate

                        if(matiere){
                        //    lastSkill = lastSkill+" "+lang.translate('logBook.in')+" "+matiere
                            fullTitle = fullTitle+" "+lang.translate('logBook.in')+" "+matiere
                        }

                        var subsections = [{
                            header: headskill,
                            content: competence
                        }];

                        if($(skill).find('Item').text()){
                            subsections.push({
                                header: headitem,
                                content: item
                            })
                        }
                        allSkills.push({
                            value: fullTitle,
                            subsections: subsections
                        });
                        that.compact = allSkills[0].value
                    }
                })
                that.full = allSkills
            }
        },
        lightboxTitle: "logBook.skills.all"
    }
]

widget.showLightbox = false

widget.openLightBox = function(contentType, eleve){
    widget.currentContentType = contentType
    widget.currentEleve = eleve

    //if []!empty
        widget.showLightbox = true
}

http().get('/sso/pronote')
    .done(function(structures){
        widget.structures = structures;
        widget.eleves = []
        structures.forEach(function(structure){
            var serviceUrl = structure.address;
            var xmlDocument = $.parseXML(structure.xmlResponse);
            var $xml = $(xmlDocument);
            //console.log(xml);
            //console.log($xml.find('Eleve').first().attr('sessionENT'));

            widget.eleves = widget.eleves.concat($.makeArray($xml.find('Eleve')));
            // widget.eleves.forEach(function(eleve){
            //
            // })
        });

    model.widgets.apply();
})
