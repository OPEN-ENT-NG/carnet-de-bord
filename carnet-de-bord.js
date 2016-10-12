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

// widget.parentInfos = function(){
//     return widget.model.me.childrenIds
// }
// http().get('/userbook/api/person?id='+childId)
//     .done(function(childInfos){
//         });
// })

widget.contentTypes = [
    {
        title: "lateness",
        icon: "timer-off",
        compact: "",
        full: [],
        getContent: function(myeleve){

            var that = this
            var delays = $(myeleve).find('Retard Justifie')
            var latedate = false;
            var allDelays = []
            that.compact = false;
            that.full = false;

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
        getContent: function(myeleve){

            var that = this
            var allAbsences = []
            that.compact = false;
            that.full = false;

            var absences = $(myeleve).find('Absence Justifie')

            if(absences){
                absences.each(function(i, absence){

                    if($(absence).text() === 'false'){

                        if($(absence).parent().find('EstOuverte').text()==="false"){
                            // du... au...
                            var startdate = $(absence).parent().find('DateDebut').text();
                            var enddate = $(absence).parent().find('DateFin').text();
                            startdate = moment(startdate);
                            enddate = moment(enddate);
                            startdate = startdate.format('DD/MM/YYYY HH:mm');
                            enddate = enddate.format('DD/MM/YYYY HH:mm');

                            var absDate = lang.translate('logBook.from')+" "+startdate +" "+lang.translate('logBook.to')+" "+enddate;
                        }else {
                            var absDate = $(absence).parent().find('DateDebut').text()
                            absDate = moment(absDate);
                            absDate = absDate.format('DD/MM/YYYY HH:mm');
                            absDate = lang.translate('logBook.the')+" "+  absDate;
                        }
                        allAbsences.push({
                            value : absDate
                        });
                        that.compact = allAbsences[0].value
                    }
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
        getContent: function(myeleve){

            var that = this
            var allGrades = []
            that.compact = false;
            that.full = false;

            var isnote = $(myeleve).find('PageReleveDeNotes Devoir Note').text();
            if(isnote){
                var lastNotes = $(myeleve).find('PageReleveDeNotes Devoir')

                lastNotes.each(function(i, result){
                    var note = $(result).find('Note').text();
                    var bareme = $(result).find('Bareme').text();
                    var matiere = $(result).find('Matiere').text();
                    var notedate = moment($(result).find('Date').text());
                    notedate = notedate.format('DD/MM/YYYY');
                    var grade = note+"/"+bareme+" "+lang.translate('logBook.in')+" "+matiere+" "+lang.translate('logBook.the')+" "+notedate;

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
        getContent: function(myeleve, compact){

            var that = this
            var allWorks = []
            that.compact = false;
            that.full = false;

            var iswork = $(myeleve).find('PageCahierDeTextes CahierDeTextes TravailAFaire Descriptif').text()
            if (iswork) {

                var diaries = $(myeleve).find('PageCahierDeTextes CahierDeTextes');
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
        getContent: function(myeleve){

            var that = this
            var allSkills = []
            var subsections = []
            that.compact = false;
            that.full = false;

            var isSkill = $(myeleve).find('PageCompetences Competence').text();
//  !!! if Item
            if (isSkill) {
                var skills = $(myeleve).find('PageCompetences Competence').parent()
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

widget.getEleve = function(eleve){
    widget.myeleve = eleve
    widget.contentTypes.forEach(function(type){
       type.getContent(widget.myeleve)
    });
}

widget.openLightBox = function(contentType, myeleve){
    widget.currentContentType = contentType
    widget.currentEleve = myeleve
    widget.showLightbox = true
}



//console.log(eleve)


http().get('/sso/pronote')
    .done(function(structures){
        widget.structures = structures;
        widget.eleves = []
        structures.forEach(function(structure){
            var serviceUrl = structure.address;
            var xmlDocument = $.parseXML(structure.xmlResponse);
            var $xml = $(xmlDocument);
            widget.eleves = widget.eleves.concat($.makeArray($xml.find('Eleve')));
            if(!widget.myeleve){
                widget.getEleve(widget.eleves[0])
            }
        });

    model.widgets.apply();
})
