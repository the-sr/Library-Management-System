package library.services.impl;

import library.dto.Report.LibraryReportDto;
import library.dto.Report.ReportDto;
import library.dto.Report.UserReportDto;
import library.enums.ReportFormat;
import library.services.ReportService;
import lombok.extern.slf4j.Slf4j;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.design.*;
import net.sf.jasperreports.engine.type.HorizontalTextAlignEnum;
import net.sf.jasperreports.engine.type.VerticalTextAlignEnum;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@Slf4j
public class ReportServiceImpl implements ReportService {

    @Value("${spring.datasource.driver-class-name}")
    String driver;
    @Value("${spring.datasource.url}")
    String url;
    @Value("${spring.datasource.username}")
    String username;
    @Value("${spring.datasource.password}")
    String password;

    @Override
    public void generateLibraryReport(ReportFormat reportFormat) {
        try {
            JasperDesign design = jasperDesign("Library Report");

            LibraryReportDto dto = new LibraryReportDto();

            //query
            if(dto.getQuery()!=null && !dto.getQuery().isEmpty()) {
                JRDesignQuery query = new JRDesignQuery();
                query.setText(dto.getQuery());
                design.setQuery(query);
            }

            //styles
            JRDesignStyle titleStyle = createStyle("TitleStyle","Times New Roman", 12f, true, false, false, HorizontalTextAlignEnum.CENTER, VerticalTextAlignEnum.JUSTIFIED, Color.BLACK, Color.WHITE);
            design.addStyle(titleStyle);
            JRDesignStyle normalStyle = createStyle("NormalStyle","Times New Roman", 12f, false, false, false, HorizontalTextAlignEnum.JUSTIFIED, VerticalTextAlignEnum.JUSTIFIED, Color.BLACK, Color.WHITE);
            design.addStyle(normalStyle);

            //titleBand
            JRDesignBand titleBand=createTitleBand(design,titleStyle,titleStyle,dto);
            design.setTitle(titleBand);

            //compile and export
            compileAndExport(design,reportFormat,"Library Report");

        }catch (Exception e){
            log.error("Error creating report: "+e.getMessage());
        }

    }

    @Override
    public void generateUserReport(ReportFormat reportFormat, Long userId) {
        try{
            JasperDesign design = jasperDesign("User Report");
            UserReportDto dto=new UserReportDto();

            //query
            if(dto.getQuery()!=null && !dto.getQuery().isEmpty()) {
                String temp=dto.getQuery()+userId;
                JRDesignQuery query = new JRDesignQuery();
                query.setText(temp);
                design.setQuery(query);
            }

            //styles
            JRDesignStyle titleStyle = createStyle("TitleStyle","Times New Roman", 12f, true, false, false, HorizontalTextAlignEnum.CENTER, VerticalTextAlignEnum.JUSTIFIED, Color.BLACK, Color.WHITE);
            design.addStyle(titleStyle);
            JRDesignStyle normalStyle = createStyle("NormalStyle","Times New Roman", 12f, false, false, false, HorizontalTextAlignEnum.JUSTIFIED, VerticalTextAlignEnum.JUSTIFIED, Color.BLACK, Color.WHITE);
            design.addStyle(normalStyle);

            //fields
            createField(design,dto.getFields());

            //titleBand
            JRDesignBand titleBand=createTitleBand(design,titleStyle,titleStyle,dto);
            design.setTitle(titleBand);

            JRDesignBand headerBand=createHeaderBand(design,normalStyle,dto);
            design.setPageHeader(headerBand);

            compileAndExport(design,reportFormat,"User Report");

        }catch (Exception e){
            log.error("Error creating report");
        }
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
        jasperDesign.setColumnWidth(473);
        return jasperDesign;
    }

    private void compileAndExport(JasperDesign design, ReportFormat reportFormat, String name){
        try{
            JasperReport jasperReport = JasperCompileManager.compileReport(design);
            Class.forName(driver);
            Connection con = DriverManager.getConnection(url, username, password);
            Map<String, Object> parameters = new HashMap<>();
            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, con);
            if (reportFormat.equals(ReportFormat.PDF))
                JasperExportManager.exportReportToPdfFile(jasperPrint,name+".pdf");
            else if (reportFormat.equals(ReportFormat.XLSX))
                JasperExportManager.exportReportToXmlFile(jasperPrint,name+".xlsx",false);
            else if (reportFormat.equals(ReportFormat.HTML))
                JasperExportManager.exportReportToHtmlFile(jasperPrint, name+".html");
            else if (reportFormat.equals(ReportFormat.XML))
                JasperExportManager.exportReportToXmlFile(jasperPrint, name+".xml",false);
            else throw new RuntimeException("Invalid report format");

            log.info("Report generated successfully");
        }catch (Exception e){
            log.error("Error while compiling and exporting report: "+e.getMessage());
        }

    }

    private JRDesignStyle createStyle(String name,String fontName, float fontSize, boolean isBold, boolean isItalic, boolean isUnderlined, HorizontalTextAlignEnum hAlign, VerticalTextAlignEnum vAlign, Color foreColor, Color backColor) {
        JRDesignStyle style = new JRDesignStyle();
        style.setName(name);
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

    private JRDesignBand createTitleBand(JasperDesign design, JRDesignStyle titleStyle, JRDesignStyle subTitleStyle, ReportDto dto){
        JRDesignBand band=new JRDesignBand();
        AtomicInteger y=new AtomicInteger(0);

        if(dto.getTitles()!=null && !dto.getTitles().isEmpty()){
            dto.getTitles().forEach(title->{
                int height=(int)(titleStyle.getFontSize()*1.5);
                JRDesignStaticText text=createStaticText(0,y.get(),design.getColumnWidth(),height,titleStyle);
                text.setText(title);
                band.addElement(text);
                y.getAndAdd(height);
            });
        }

        if(dto.getSubtitles()!=null && !dto.getSubtitles().isEmpty()){
            dto.getSubtitles().forEach(subtitle->{
                int height=(int)(titleStyle.getFontSize()*1.5);
                JRDesignStaticText text=createStaticText(0,y.get(),design.getColumnWidth(),height,subTitleStyle);
                text.setText(subtitle);
                band.addElement(text);
                y.getAndAdd(height);
            });
        }

        int lineHeight=2;
        JRDesignLine line1=createLine(0,y.get(),design.getColumnWidth(),lineHeight);
        band.addElement(line1);
        y.getAndAdd(lineHeight);

        band.setHeight(y.get());
        return  band;
    }

    private JRDesignBand createHeaderBand(JasperDesign jasperDesign,JRDesignStyle style, ReportDto dto){
        JRDesignBand band=new JRDesignBand();
        AtomicInteger y1=new AtomicInteger(0);
        AtomicInteger y2=new AtomicInteger(0);
        Map<String,Object> fields=new HashMap<>();

        fields=dto.getLeftSideHeaderFields();
        if(fields!=null && !fields.isEmpty()){
            Set<String> fieldSet=fields.keySet();
            fieldSet.forEach(f->{
                JRDesignExpression expression=new JRDesignExpression();
                expression.setText("\""+f+"\"+$F{"+f+"}");
                JRDesignTextField textField=createTextField(0,y1.getAndAdd((int) (style.getFontSize()+5)), jasperDesign.getColumnWidth()/2, (int) (5+style.getFontSize()),style);
                textField.setExpression(expression);
                band.addElement(textField);
            });
        }

        fields=dto.getRightSideHeaderFields();
        if(fields!=null && !fields.isEmpty()){
            Set<String> fieldSet=fields.keySet();
            fieldSet.forEach(f->{
                JRDesignExpression expression=new JRDesignExpression();
                expression.setText("\""+f+"\"+$F{"+f+"}");
                JRDesignTextField textField=createTextField(jasperDesign.getColumnWidth()/2,y2.getAndAdd((int) (style.getFontSize()+5)), jasperDesign.getColumnWidth()/2, (int) (5+style.getFontSize()),style);
                textField.setExpression(expression);
                band.addElement(textField);
            });
        }

        band.setHeight(Math.max(y1.get(), y2.get()));
        return band;
    }

    private JRDesignStaticText createStaticText(int x, int y, int width, int height, JRDesignStyle style){
        JRDesignStaticText text=new JRDesignStaticText();
        text.setX(x);
        text.setY(y);
        text.setWidth(width);
        text.setHeight(height);
        text.setStyle(style);
        return text;
    }

    private JRDesignTextField createTextField(int x, int y, int width, int height, JRDesignStyle style){
        JRDesignTextField textField=new JRDesignTextField();
        textField.setX(x);
        textField.setY(y);
        textField.setWidth(width);
        textField.setHeight(height);
        textField.setStyle(style);
        return textField;
    }

    private JRDesignLine createLine(int x, int y, int width, int height){
        JRDesignLine line=new JRDesignLine();
        line.setX(x);
        line.setY(y);
        line.setWidth(width);
        line.setHeight(height);
        return line;
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
                    log.error("Error creating field \"{}\": {}", f, e.getMessage());
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
