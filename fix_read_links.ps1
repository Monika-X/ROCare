$file = 'c:\Users\LOKII_1526\Desktop\ROCare\pages\blog.html'
$lines = Get-Content $file -Encoding UTF8
$cardNum = 0
$result = @()
foreach ($line in $lines) {
    if ($line -match '<!-- Card (\d+)') {
        $cardNum = [int]$Matches[1]
    }
    if ($line -match 'Read Article' -and $line -match 'blog-details\.html') {
        $newHref = "blog-details-$cardNum.html"
        $line = $line -replace 'blog-details\.html', $newHref
    }
    $result += $line
}
Set-Content $file -Value $result -Encoding UTF8
Write-Host "Read Article links updated."
