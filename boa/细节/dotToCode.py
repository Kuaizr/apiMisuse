import re

def readfile(filename):
    with open(filename,'r') as f:
        content_list = f.readlines()
        contentall = [x.strip() for x in content_list]
        return contentall

def findSubStr_clark(sourceStr, str, i):
    count=0
    rs=0
    for c in sourceStr:
        rs=rs+1
        if(c==str):
            count=count+1
        if(count==i):
            return rs

def getlabel(str2):
    if getShape(str2):
        temp = re.findall("\"(.*)\"",str2)[0]
        temp = temp[4:]
        if "{" in temp:
            index = findSubStr_clark(temp,"{",1) - 1
            temp = temp[:index]
            if "if" in temp:
                temp = temp.replace("if","").strip()
                p = re.compile(r"[(](.*)[)]", re.S)
                temp = re.findall(p,temp)[0]
            if "try" in temp:
                temp = "try"
            return temp
        return temp
    else:
        temp = re.findall("\"(.*)\"",str2)
        if temp:
            return temp[0]
        else:
            return None

def getShape(str3):
    result = re.findall("shape=(.*?),",str3)
    if result:
        return result[0]
    else:
        return None

def getVariables(str4):
    p = re.compile(r"[\[][\[](.*?)[\]][\]]", re.S)
    result = re.findall(p,str4)
    if result:
        temp = result[0]
        results = temp.split(",")
        resu = []
        for i in results:
            if i:
                resu.append(i.strip())
        return resu
    else:
        return None

def SortVariable(varis,Code,keywords):
    length = len(varis)
    if len(varis) <= 1:
        return varis
    result = []
    keyIndex = set()
    leave = []
    for index,i in enumerate(Code):
        for keyword in keywords:
            if keyword in i:
                keyIndex.add(index)
    for i in varis:
        flag = True
        for k in keyIndex:
            if i in Code[k]:
                result.append(i)
                flag = False
                break
        if(flag):
            leave.append(i)

    result = list(set(result))
    leave = list(set(leave))
    if(length == len(leave)):
        return leave
    result.append(SortVariable(leave,Code,result))
    return result

def getBounds(Varsi,k):
    if (k == 0):
        return []
    result = []
    for v in Varsi:
        if isinstance(v,str):
            result.append(v)
        elif isinstance(v,list):
            result.extend(getBounds(v,k-1))
    return result
    
def getNums(str5):
    return re.findall("\d+\.?\d*",str5)

def dotToCode(filename,key,bound):
    context = readfile(filename)

    keywords = [key]
    varsi = getVariables(context[0])

    elseCode = []
    backCode = []
    whileCode = []
    tempCode = []

    for i in context:
        t = getShape(i)
        if t:
            if ("diamond" in t):
                if "try" in getlabel(i):
                    tempCode.append(getlabel(i))
                else:
                    s = "IF " + getlabel(i)
                    tempCode.append(s)    
            else:
                tempCode.append(getlabel(i))
        else:
            if getlabel(i):
                if "F" in getlabel(i):
                    elseCode.append(getNums(i)[1])
                elif "B" in getlabel(i):
                    backCode.append(getNums(i)[0])
                    whileCode.append(getNums(i)[1])


    for i in elseCode:
        if "catch" in i == False:
            tempCode[int(i)] = "ELSE " + tempCode[int(i)]
    for i in whileCode:
        tempCode[int(i)] = tempCode[int(i)].replace("IF","WHILE")
    for i in backCode:
        tempCode[int(i)] = tempCode[int(i)] + " BACK"

    tempVars = SortVariable(varsi,tempCode,keywords)
    SortVars = getBounds(tempVars,bound)  
    print(SortVars)
                
    resultCode = []

    for i in tempCode:
        for k in SortVars:
            if (k in i) or ("try" in i) or ("catch" in i):
                resultCode.append(i)
                break

    for i in resultCode:
        print(i)

dotToCode("test.gv","createNewFile",1)

