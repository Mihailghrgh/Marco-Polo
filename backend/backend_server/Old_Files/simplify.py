import math


def DouglasPeucker(list, epsilon=0.0005):
    dmax = 0
    end = len(list) - 1
    max_index = 0
    index = 1

    while index < end:
        dist = perpendicular_Dist(list[index], list[0], list[end])
        # Tolerance not met
        if dist > dmax:
            dmax = dist
            max_index = index
        index += 1

    # if max distances bends and is above tollerance
    if dmax > epsilon:
        recursive_Left = DouglasPeucker(list[: max_index + 1], epsilon)
        recursive_Right = DouglasPeucker(list[max_index:], epsilon)

        return recursive_Left[:-1] + recursive_Right
    else:
        return [list[0], list[-1]]


def perpendicular_Dist(point, start, end):
    x0 = point[0] 
    y0 = point[1]

    x1 = start[0]
    y1 = start[1]

    x2 = end[0]
    y2 = end[1]

    if x1 == x2 and y1 == y2:
        return math.dist(point, start)

    dx = x2 - x1
    dy = y2 - y1

    numerator = abs(dy * x0 - dx * y0 + x2 * y1 - y2 * x1)
    denominator = math.sqrt(dx * dx + dy * dy)

    return numerator / denominator
