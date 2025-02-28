package library.services.impl;

import library.dto.Report.LibraryReportDto;
import library.dto.Report.ReportDto;
import library.services.ReportService;
import lombok.extern.slf4j.Slf4j;
import net.sf.jasperreports.engine.design.*;
import net.sf.jasperreports.engine.type.HorizontalTextAlignEnum;
import net.sf.jasperreports.engine.type.VerticalTextAlignEnum;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@Slf4j
public class ReportServiceImpl implements ReportService {

    @Override
    public void generateLibraryReport() {
        try {
            JasperDesign design = jasperDesign("Library Report");

            //styles
            JRDesignStyle titleStyle = createStyle("Times New Roman", 12f, true, false, false, HorizontalTextAlignEnum.CENTER, VerticalTextAlignEnum.JUSTIFIED, Color.BLACK, Color.WHITE);
            design.addStyle(titleStyle);
            JRDesignStyle normalStyle = createStyle("Times New Roman", 12f, false, false, false, HorizontalTextAlignEnum.JUSTIFIED, VerticalTextAlignEnum.JUSTIFIED, Color.BLACK, Color.WHITE);
            design.addStyle(normalStyle);

            LibraryReportDto dto = new LibraryReportDto();

            //query
            JRDesignQuery query = new JRDesignQuery();
            query.setText(dto.getQuery());
            design.setQuery(query);

            createField(design, dto.getLeftSideHeaderFields());
            createField(design, dto.getRightSideHeaderFields());

            createField(design, dto.getFields());

            createField(design,dto.getLeftSideSummaryFields());
            createField(design, dto.getRightSideSummaryFields());

            //titleBand
            JRDesignBand titleBand=createBand(design,titleStyle,null,dto);
            design.setTitle(titleBand);


        }catch (Exception e){
            log.error("Error creating report: "+e.getMessage());
        }

    }

    @Override
    public void generateUsersReport() {
        JasperDesign design=jasperDesign("Users Report");

    }

    @Override
    public void generateBookReport() {
        JasperDesign design=jasperDesign("Book Report");

    }

    @Override
    public void generateUserBookReport() {

    }

    private JasperDesign jasperDesign(String name){
        JasperDesign jasperDesign=new JasperDesign();
        jasperDesign.setName(name);
        jasperDesign.setPageHeight(842);
        jasperDesign.setPageWidth(545);
        jasperDesign.setTopMargin(36);  //0.5 inch
        jasperDesign.setRightMargin(36);    //0.5 inch
        jasperDesign.setBottomMargin(36);   //0.5 inch
        jasperDesign.setLeftMargin(36); //0.5 inch
        jasperDesign.setColumnWidth(770);
        return jasperDesign;
    }

    private JRDesignStyle createStyle(String fontName, float fontSize, boolean isBold, boolean isItalic, boolean isUnderlined, HorizontalTextAlignEnum hAlign, VerticalTextAlignEnum vAlign, Color foreColor, Color backColor) {
        JRDesignStyle style = new JRDesignStyle();
        style.setFontName(fontName);
        style.setFontSize(fontSize);
        style.setBold(isBold);
        style.setItalic(isItalic);
        style.setUnderline(isUnderlined);
        style.setHorizontalTextAlign(hAlign);
        style.setVerticalTextAlign(vAlign);
        style.setForecolor(foreColor);
        style.setBackcolor(backColor);
        return style;
    }

    private JRDesignBand createBand(JasperDesign design, JRDesignStyle titleStyle, JRDesignStyle subTitleStyle, ReportDto dto){

        JRDesignBand band=new JRDesignBand();
        AtomicInteger y=new AtomicInteger(0);

        if(dto.getTitles()!=null && !dto.getTitles().isEmpty()){
            dto.getTitles().forEach(title->{
                JRDesignStaticText text=createStaticText(0, y.getAndAdd((int) (titleStyle.getFontSize()+5)),design.getColumnWidth(),titleStyle);
                text.setText(title);
                band.addElement(text);
            });
        }

        band.setHeight(y.get());
        return  band;
    }

    private JRDesignStaticText createStaticText(int x, int y, int width, JRDesignStyle style){
        JRDesignStaticText text=new JRDesignStaticText();
        text.setX(x);
        text.setY(y);
        text.setWidth(width);
        text.setStyle(style);
        return text;
    }

    private void createField(JasperDesign design, Map<String,Object> fieldsMap){
        if(fieldsMap!=null && !fieldsMap.isEmpty()){
            Set<String> fields=fieldsMap.keySet();
            fields.forEach(f->{
                JRDesignField field=new JRDesignField();
                field.setName(f);
                field.setValueClass(fieldsMap.get(f).getClass());
                try{
                    design.addField(field);
                }catch (Exception e){
                    log.info("Error creating field \""+f+"\": "+e.getMessage());
                }
            });
        }
    }

    private void createVariable (JasperDesign design, Map<String,Object> variablesMap){
        if(variablesMap!=null && !variablesMap.isEmpty()){
            Set<String> variables=variablesMap.keySet();
            variables.forEach(v->{

            });
        }
    }


}
