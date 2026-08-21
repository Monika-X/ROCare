$file = 'c:\Users\LOKII_1526\Desktop\ROCare\pages\blog.html'
$lines = Get-Content $file -Encoding UTF8
$cardNum = 0
$result = @()
foreach ($line in $lines) {
    if ($line -match '<!-- Card (\d+)') {
        $cardNum = [int]$Matches[1]
    }
    # Fix h3 title links still pointing to blog-details.html
    if ($line -match '<a href="blog-details\.html">' -and $line -match '<h3') {
        $newHref = "blog-details-$cardNum.html"
        $line = $line -replace 'href="blog-details\.html"', "href=`"$newHref`""
    }
    $result += $line
}
Set-Content $file -Value $result -Encoding UTF8
Write-Host "Title links fixed."
