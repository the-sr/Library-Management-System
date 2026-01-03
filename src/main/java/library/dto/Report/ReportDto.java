package library.dto.Report;

import lombok.Getter;

import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;

@Getter
public class ReportDto {
    String query;
    Set<String> titles = new LinkedHashSet<>();
    Set<String> subtitles = new LinkedHashSet<>();
    Map<String, Object> titleDetails=new LinkedHashMap<>();
    Map<String, Object> leftSideHeaderFields = new LinkedHashMap<>();
    Map<String, Object> rightSideHeaderFields = new LinkedHashMap<>();

    Map<String, Object> fields = new LinkedHashMap<>();
    Map<String, String> expressions = new LinkedHashMap<>();
    Map<String, Object> leftSideSummaryFields = new LinkedHashMap<>();
    Map<String, Object> rightSideSummaryFields = new LinkedHashMap<>();
}
