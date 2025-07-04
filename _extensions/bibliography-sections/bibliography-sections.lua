-- Lua filter to organize bibliography by type
function Div(div)
  if div.identifier == "refs" then
    -- This will be replaced by the bibliography
    return div
  end
end

-- Function to categorize entries
function categorize_entry(entry)
  local entry_type = entry.type
  
  if entry_type == "book" then
    return "Books"
  elseif entry_type == "article" then
    return "Journal Articles"
  elseif entry_type == "incollection" then
    return "Book Chapters"
  elseif entry_type == "unpublished" then
    return "Working Papers"
  else
    return "Other Publications"
  end
end