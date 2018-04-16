$(() =>{
        enable_search('#department-search','#department-ul .form-row','.department-name');
        enable_search('#taxonomy-search','#taxonomy-ul .form-row','.taxonomy-name');
        enable_search('#keyword-search','#keyword-box .form-row','.keyword-name');

});


function enable_search(search_box, div_to_showhide, div_text_element) {
    $(search_box).on('keyup', () => {

        let searchText = $(search_box).val().toLowerCase();
        let rows = $(div_to_showhide);

        $.each(rows, (index) => {
            let department_name = $(rows[index]).find(div_text_element).text().toLowerCase();

            if(department_name.indexOf(searchText) > -1){
                $(rows[index]).fadeIn();
            }
            else {
                $(rows[index]).fadeOut();
            }
        });

    });
}