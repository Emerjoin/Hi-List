package mz.co.hi.web.component;


import mz.co.hi.web.meta.WebComponent;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

@WebComponent
public class HiList {


    /**
     * Calculates the number of pages to be presented by HiList component.
     * @since 1.4
     * @param matches - total matched records
     * @param perPage - items per page
     * @return the total number of pages to navigate through the records.
     */
    public static int pages(int matches, int perPage){

        int pages = matches / perPage;
        double mod =  matches % perPage;
        if(mod>0)
             ++pages;

        return pages;

    }


    public static Map listEncode(Collection data, int matches, int page, int pages) throws IllegalArgumentException{

        if(data==null)
            throw new IllegalArgumentException();

        Object[] array = new Object[data.size()];
        data.toArray(array);

        return listEncode(array,matches,page,pages);

    }

    public static Map listEncode(Object[] data,int matches, int page, int pages) throws IllegalArgumentException{

        if(data==null||matches<0||pages<0||page<0)
            throw new IllegalArgumentException();

        Map result = new HashMap();
        result.put("data",data);
        result.put("totalRowsMatch",matches);
        result.put("pageNumber",page);
        result.put("totalPagesMatch",pages);
        return result;

    }

}
