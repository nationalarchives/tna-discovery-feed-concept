$(() =>{
        enable_search('#department-search','#department-ul .form-row','.department-name');
        enable_search('#taxonomy-search','#taxonomy-ul .form-row','.taxonomy-name');
        enable_search('#keyword-search','#keyword-box .form-row','.keyword-name');
});


function enable_search(search_box, div_to_showhide, element_to_filter) {
    $(search_box).on('keyup', () => {

        let searchText = $(search_box).val().toLowerCase();
        let rows = $(div_to_showhide);

        $.each(rows, (index) => {
            let element = $(rows[index]).find(element_to_filter).text().toLowerCase();

            if(element.indexOf(searchText) > -1){
                $(rows[index]).show();
            }
            else {
                $(rows[index]).hide();
            }
        });

    });
}